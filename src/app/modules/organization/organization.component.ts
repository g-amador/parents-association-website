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
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
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
    direction: [],
    assembly: [],
    fiscalCouncil: []
  };

  /**
   * Tracks whether the user is on an admin route.
   * It is set based on user authentication status.
   */
  public isAdminRoute: boolean = false;

  // The service used for organization contacts, chosen dynamically based on environment
  private organizationService: LocalStorageService | FirestoreService;

  /**
   * Constructor for the OrganizationComponent class.
   * It injects services needed for making HTTP requests, handling dialogs, routing, authentication,
   * and working with local storage or Firestore for data persistence.
   *
   * @param http - Service for making HTTP requests to fetch data (like the JSON backup).
   * @param dialog - Service for opening dialogs to edit contact information.
   * @param route - Provides access to route data and parameters.
   * @param authService - Service to check the user's authentication status.
   * @param localStorageService - Service to manage storing and retrieving data from local storage.
   * @param firestoreService - Service to manage Firestore interactions for reading and writing data.
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
   * Initializes the component, adjusts sidebar visibility, loads contacts,
   * and determines whether the current route is for admin users.
   */
  public ngOnInit(): void {
    this.adjustSidebarVisibility();
    this.loadContacts();

    // Subscribe to route data to detect if the current route is admin
    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  /**
   * Adjusts the visibility of the sidebar based on the window size.
   * Sidebar is hidden for screens smaller than 768px.
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
        direction: [] as Contact[],
        assembly: [] as Contact[],
        fiscalCouncil: [] as Contact[]
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
      console.error('Error loading contacts:', error);
    }
  }

  /**
   * Loads contacts from local storage.
   * The contacts are saved under specific keys for 'Direction', 'Assembly', and 'Fiscal Council'.
   */
  public async loadContactsFromLocalStorage(): Promise<void> {
    // Check for Direction contacts in local storage
    const storedDirection = localStorage.getItem('contact-Direction');
    if (storedDirection) {
      this.contacts.direction = JSON.parse(storedDirection);
    }

    // Check for Assembly contacts in local storage
    const storedAssembly = localStorage.getItem('contact-Assembly');
    if (storedAssembly) {
      this.contacts.assembly = JSON.parse(storedAssembly);
    }

    // Check for Fiscal Council contacts in local storage
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
    // Determine if any contact groups are missing
    const missingDirection = this.contacts.direction.length === 0;
    const missingAssembly = this.contacts.assembly.length === 0;
    const missingFiscalCouncil = this.contacts.fiscalCouncil.length === 0;

    // Load missing data from JSON if needed
    if (missingDirection || missingAssembly || missingFiscalCouncil) {
      const jsonData = await this.http.get<any>('assets/data/organizationContacts.json').toPromise();
      const members = jsonData.members;

      // If Direction is missing, load it from JSON
      if (missingDirection) {
        this.contacts.direction = members.Direction.map((contact: any) => ({
          role: contact.role,
          name: contact.name,
          email: contact.email || '',
          phone: contact.phone || '',
          image: contact.image || 'assets/images/organizationContacts/generic-user.jpg' // Default image
        }));

        // Save to local storage or Firestore based on environment
        if (environment.useLocalStorage) {
          localStorage.setItem('contact-Direction', JSON.stringify(this.contacts.direction));
        } else {
          await this.organizationService.setContact('Direction', this.contacts.direction);
        }
      }

      // If Assembly is missing, load it from JSON
      if (missingAssembly) {
        this.contacts.assembly = members.Assembly.map((contact: any) => ({
          role: contact.role,
          name: contact.name,
          email: contact.email || '',
          phone: contact.phone || '',
          image: contact.image || 'assets/images/organizationContacts/generic-user.jpg' // Default image
        }));

        // Save to local storage or Firestore
        if (environment.useLocalStorage) {
          localStorage.setItem('contact-Assembly', JSON.stringify(this.contacts.assembly));
        } else {
          await this.organizationService.setContact('Assembly', this.contacts.assembly);
        }
      }

      // If Fiscal Council is missing, load it from JSON
      if (missingFiscalCouncil) {
        this.contacts.fiscalCouncil = members['Fiscal Council'].map((contact: any) => ({
          role: contact.role,
          name: contact.name,
          email: contact.email || '',
          phone: contact.phone || '',
          image: contact.image || 'assets/images/organizationContacts/generic-user.jpg' // Default image
        }));

        // Save to local storage or Firestore
        if (environment.useLocalStorage) {
          localStorage.setItem('contact-Fiscal Council', JSON.stringify(this.contacts.fiscalCouncil));
        } else {
          await this.organizationService.setContact('Fiscal Council', this.contacts.fiscalCouncil);
        }
      }
    }
  }

  /**
   * Saves the contacts data to either local storage or Firestore based on the environment.
   */
  public async saveContacts(): Promise<void> {
    try {
      await this.organizationService.setContact('Direction', this.contacts.direction);
      await this.organizationService.setContact('Assembly', this.contacts.assembly);
      await this.organizationService.setContact('Fiscal Council', this.contacts.fiscalCouncil);
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  }

  /**
   * Opens a dialog for editing the selected contact.
   * The dialog allows the user to edit the contact details, and saves the changes if confirmed.
   *
   * @param contact - The contact object to be edited.
   * @param group - The group (Direction, Assembly, Fiscal Council) the contact belongs to.
   * @param index - The index of the contact in the group array.
   */
  public editContact(contact: any, group: string, index: number): void {
    if (this.isAdminRoute) {
      const dialogRef = this.dialog.open(EditOrganizationContactDialogComponent, {
        width: '400px',
        data: { contact }
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          // Update the contact with the edited result
          this.contacts[group][index] = result;
          await this.saveContacts(); // Save updated contacts
        }
      });
    }
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
