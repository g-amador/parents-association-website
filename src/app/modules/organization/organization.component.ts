import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditOrganizationContactDialogComponent } from './edit-organization-contact-dialog/edit-organization-contact-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { Contact } from '../../shared/models/contact.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-organization', // Selector for the component
  templateUrl: './organization.component.html', // Template URL for the component's HTML
  styleUrls: ['./organization.component.scss'] // Stylesheet for the component
})
export class OrganizationComponent implements OnInit {

  /**
   * Controls whether the sidebar is visible.
   * Default is set to `true`, but adjusts based on screen size.
   */
  public sidebarVisible = true;

  /**
   * Holds contacts data categorized into 'direction', 'assembly', and 'fiscalCouncil'.
   */
  public contacts: any = {
    direction: [] as Contact[],
    assembly: [] as Contact[],
    fiscalCouncil: [] as Contact[]
  };

  /**
   * Tracks whether the user is on an admin route.
   * It is set based on user authentication status.
   */
  public isAdminRoute: boolean = false;

  // Service used for organization contacts, chosen dynamically based on environment
  private organizationService: LocalStorageService | FirestoreService;

  /**
   * Constructor for the OrganizationComponent class.
   * It injects services needed for making HTTP requests, handling dialogs, routing,
   * authentication, and working with local storage or Firestore for data persistence.
   *
   * @param http - Service for making HTTP requests to fetch data (like the JSON backup)
   * @param dialog - Service for opening dialogs to edit contact information
   * @param route - Provides access to route data and parameters
   * @param authService - Service to check the user's authentication status
   * @param localStorageService - Service to manage storing and retrieving data from local storage
   * @param firestoreService - Service to manage Firestore interactions for reading and writing data
   */
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private firestoreService: FirestoreService
  ) {
    // Dynamically choose between Firestore or LocalStorage based on environment
    this.organizationService = environment.production && !environment.useLocalStorage
      ? this.firestoreService
      : this.localStorageService;
  }

  /**
   * Initializes the component; adjusts sidebar visibility, loads contacts,
   * and determines whether the current route is for admin users.
   */
  public ngOnInit(): void {
    this.adjustSidebarVisibility(); // Adjust sidebar visibility based on window size
    this.loadContacts(); // Load contacts from storage or Firestore

    // Subscribe to route data to detect if the current route is admin
    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  /**
   * Adjusts the visibility of the sidebar based on the window size.
   * The sidebar is hidden for screens smaller than 768px.
   */
  public adjustSidebarVisibility(): void {
    this.sidebarVisible = window.innerWidth > 768;
  }

  /**
   * Loads contacts from either local storage or Firestore depending on the environment configuration.
   * Falls back to loading missing contacts from a JSON file if necessary.
   */
  public async loadContacts(): Promise<void> {
    try {
      this.contacts = {
        direction: [],
        assembly: [],
        fiscalCouncil: []
      };

      // Load contacts from local storage or Firestore based on the environment
      if (environment.useLocalStorage) {
        await this.loadContactsFromLocalStorage();
      } else {
        await this.loadContactsFromFirestore();
      }

      // Load missing contacts from the JSON file if necessary
      await this.loadMissingContactsFromJSON();
    } catch (error) {
      console.error('Error loading contacts:', error); // Log any loading errors
    }
  }

  /**
   * Loads contacts from local storage.
   * The contacts are saved under specific keys for 'Direction', 'Assembly', and 'Fiscal Council'.
   */
  public async loadContactsFromLocalStorage(): Promise<void> {
    // Retrieve and parse Direction contacts from local storage
    const storedDirection = localStorage.getItem('contact-Direction');
    if (storedDirection) {
      this.contacts.direction = JSON.parse(storedDirection);
    }

    // Retrieve and parse Assembly contacts from local storage
    const storedAssembly = localStorage.getItem('contact-Assembly');
    if (storedAssembly) {
      this.contacts.assembly = JSON.parse(storedAssembly);
    }

    // Retrieve and parse Fiscal Council contacts from local storage
    const storedFiscalCouncil = localStorage.getItem('contact-Fiscal Council');
    if (storedFiscalCouncil) {
      this.contacts.fiscalCouncil = JSON.parse(storedFiscalCouncil);
    }
  }

  /**
   * Loads contacts from Firestore.
   * Retrieves the 'Direction', 'Assembly', and 'Fiscal Council' contacts.
   */
  public async loadContactsFromFirestore(): Promise<void> {
    // Fetch Direction contacts from Firestore
    const storedDirection = await this.organizationService.getContact('Direction');
    if (storedDirection) {
      this.contacts.direction = [storedDirection];
    }

    // Fetch Assembly contacts from Firestore
    const storedAssembly = await this.organizationService.getContact('Assembly');
    if (storedAssembly) {
      this.contacts.assembly = [storedAssembly];
    }

    // Fetch Fiscal Council contacts from Firestore
    const storedFiscalCouncil = await this.organizationService.getContact('Fiscal Council');
    if (storedFiscalCouncil) {
      this.contacts.fiscalCouncil = [storedFiscalCouncil];
    }
  }

  /**
   * Loads any missing contacts from a local JSON file.
   * Only loads data if contacts are missing for a particular group (Direction, Assembly, Fiscal Council).
   */
  public async loadMissingContactsFromJSON(): Promise<void> {
    // Fetch the JSON file directly without members structure
    const jsonData = await this.http.get<any[]>('assets/data/organizationContacts.json').toPromise();

    // Iterate through the jsonData to populate the contacts
    jsonData!.forEach(contact => {
      // Check if the contact's role starts with 'organization_page.direction.'
      if (contact.role.startsWith('organization_page.direction.')) {
        this.contacts.direction.push({
          role: contact.role.replace('organization_page.direction.', ''), // Clean up role
          name: contact.name,
          email: contact.email || '',
          phone: contact.phone || '',
          image: contact.image || 'assets/images/organizationContacts/generic-user.jpg' // Default image
        });
      }
      // Check if the contact's role starts with 'organization_page.assembly.'
      else if (contact.role.startsWith('organization_page.assembly.')) {
        this.contacts.assembly.push({
          role: contact.role.replace('organization_page.assembly.', ''), // Clean up role
          name: contact.name,
          email: contact.email || '',
          phone: contact.phone || '',
          image: contact.image || 'assets/images/organizationContacts/generic-user.jpg' // Default image
        });
      }
      // Check if the contact's role starts with 'organization_page.fiscal_council.'
      else if (contact.role.startsWith('organization_page.fiscal_council.')) {
        this.contacts.fiscalCouncil.push({
          role: contact.role.replace('organization_page.fiscal_council.', ''), // Clean up role
          name: contact.name,
          email: contact.email || '',
          phone: contact.phone || '',
          image: contact.image || 'assets/images/organizationContacts/generic-user.jpg' // Default image
        });
      }
    });

    // Save loaded contacts to local storage or Firestore based on the environment
    if (environment.useLocalStorage) {
      localStorage.setItem('contact-Direction', JSON.stringify(this.contacts.direction));
      localStorage.setItem('contact-Assembly', JSON.stringify(this.contacts.assembly));
      localStorage.setItem('contact-Fiscal Council', JSON.stringify(this.contacts.fiscalCouncil));
    } else {
      await this.organizationService.setContact('Direction', this.contacts.direction);
      await this.organizationService.setContact('Assembly', this.contacts.assembly);
      await this.organizationService.setContact('Fiscal Council', this.contacts.fiscalCouncil);
    }
  }

  /**
   * Saves the contacts data to either local storage or Firestore based on the environment.
   */
  public async saveContacts(): Promise<void> {
    try {
      // Save contacts for Direction, Assembly, and Fiscal Council
      await this.organizationService.setContact('Direction', this.contacts.direction);
      await this.organizationService.setContact('Assembly', this.contacts.assembly);
      await this.organizationService.setContact('Fiscal Council', this.contacts.fiscalCouncil);
    } catch (error) {
      console.error('Error saving contacts:', error); // Log any saving errors
    }
  }

  /**
   * Opens a dialog for editing the selected contact.
   * The dialog allows the user to edit the contact details and saves the changes if confirmed.
   *
   * @param contact - The contact object to be edited
   * @param group - The group (Direction, Assembly, Fiscal Council) the contact belongs to
   * @param index - The index of the contact in the group array
   */
  public openEditDialog(contact: Contact, group: string, index: number): void {
    const dialogRef = this.dialog.open(EditOrganizationContactDialogComponent, {
      width: '400px', // Width of the dialog
      data: { contact, group, index } // Data to be passed to the dialog
    });

    // Handle the dialog close event to update the contacts if confirmed
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the contact in the appropriate group array
        this.contacts[group][index] = result;
        this.saveContacts(); // Save the updated contacts
      }
    });
  }

  /**
   * Toggles the sidebar's visibility.
   *
   * @param sidebarVisible - Boolean flag to show or hide the sidebar.
   */
  public toggleSidebarVisibility(sidebarVisible: boolean): void {
    this.sidebarVisible = sidebarVisible;
  }
}
