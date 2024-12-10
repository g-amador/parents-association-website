import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditGoverningBodiesContactDialogComponent } from './edit-governing-bodies-contact-dialog/edit-governing-bodies-contact-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Contact } from '../../../shared/models/contact.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-governing-bodies',
  templateUrl: './governing-bodies.component.html',
  styleUrls: ['./governing-bodies.component.scss']
})
export class GoverningBodiesComponent implements OnInit {
  contacts: Contact[] = []; // Array to store the list of contacts
  isAdminRoute: boolean = false; // Flag to check if the route is admin

  // Service used for governing bodies contacts, chosen dynamically based on environment
  private governingBodiesService: LocalStorageService | FirestoreService;

  /**
   * Constructor for the governing bodiesComponent class.
   * It injects services needed for making HTTP requests, handling dialogs, routing,
   * authentication, and working with local storage or Firestore for data persistence.
   *
   * @param http - Service for making HTTP requests to fetch data (like the JSON backup)
   * @param dialog - Service for opening dialogs to edit governing bodies contact information
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
    this.governingBodiesService = environment.production && !environment.useLocalStorage
      ? this.firestoreService
      : this.localStorageService;
  }

  /**
   * Initializes the component; adjusts sidebar visibility, loads contacts,
   * and determines whether the current route is for admin users.
   *
   * @return void
   */
  public ngOnInit(): void {
    this.loadContacts(); // Load governing bodies contacts from storage or Firestore

    // Subscribe to route data to detect if the current route is admin
    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  /**
   * Loads governing bodies contacts from either local storage or Firestore depending on the environment configuration.
   * Falls back to loading missing governing bodies contacts from a JSON file if necessary.
   *
   * @return Promise<void> - A promise that resolves when the contacts are loaded.
   */
  public async loadContacts(): Promise<void> {
    try {
      let loadedContacts: Contact[] = [];

      // Step 1: Load from Firestore or Local Storage based on the environment
      if (environment.production) {
        // Use Firestore in production
        const firestoreContacts = await this.loadContactsFromFirestore();
        if (firestoreContacts.length > 0) {
          loadedContacts = firestoreContacts;
        }
      } else {
        // Use Local Storage in development
        loadedContacts = await this.loadContactsFromLocalStorage();
      }

      // Step 2: Define the roles to check against
      const rolesToCheck = [
        "governing-bodies_page.direction.president",
        "governing-bodies_page.direction.vice_president",
        "governing-bodies_page.direction.secretary",
        "governing-bodies_page.direction.treasury",
        "governing-bodies_page.direction.vowel",
        "governing-bodies_page.assembly.president",
        "governing-bodies_page.assembly.first_secretary",
        "governing-bodies_page.assembly.second_secretary",
        "governing-bodies_page.fiscal_council.president",
        "governing-bodies_page.fiscal_council.vowel",
        "governing-bodies_page.fiscal_council.vowel"
      ];

      // Step 3: Filter governing bodies contacts that already exist in local storage or Firestore
      const existingRoles = loadedContacts.map(contact => contact.role);
      const missingRoles = rolesToCheck.filter(role => !existingRoles.includes(role));

      // Step 4: Load missing roles from JSON if needed
      if (missingRoles.length > 0) {
        console.log('Missing governing bodies contacts found. Loading from JSON...', missingRoles);

        // Load missing governing bodies contacts from JSON based on missing roles
        const contactsFromJson = await this.loadContactsFromJSON(missingRoles);

        // Add loaded governing bodies contacts from JSON to the main governing bodies contacts list and save to storage
        for (const contact of contactsFromJson) {
          loadedContacts.push(contact);  // Add newly loaded governing bodies contact to the main list

          await this.governingBodiesService.setContact(contact.role, contact);  // Save to Firestore in production
        }
      } else {
        console.log('All required governing bodies contacts are already loaded.');
      }

      // Step 5: Sort the governing bodies contacts based on rolesToCheck order
      const sortedContacts = rolesToCheck
        .map(role => loadedContacts.find(contact => contact.role === role))
        .filter(contact => contact !== undefined) as Contact[]; // Ensure all governing bodies contacts are defined

      this.contacts = sortedContacts; // Set the loaded governing bodies contacts in sorted order
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  /**
   * Helper method to load governing bodies contacts from Local Storage.
   *
   * @returns Promise<Contact[]> - A promise that resolves to an array of governing bodies contacts loaded from Local Storage.
   */
  public async loadContactsFromLocalStorage(): Promise<Contact[]> {
    const storedContacts: Contact[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('contact-')) {
        const role = key.replace('contact-', '');
        const contact = await this.governingBodiesService.getContact(role);
        if (contact) {
          storedContacts.push(contact); // Add governing bodies contact to the stored governing bodies contacts array
        }
      }
    }
    return storedContacts;
  }

  /**
   * Helper method to load governing bodies contacts from Firestore.
   *
   * @returns Promise<Contact[]> - A promise that resolves to an array of governing bodies contacts loaded from Firestore.
   */
  public async loadContactsFromFirestore(): Promise<Contact[]> {
    return new Promise<Contact[]>((resolve, reject) => {
      this.governingBodiesService.getAllContacts().subscribe(
        (data: Contact[]) => {
          resolve(data); // Resolve with loaded contacts
        },
        (error) => {
          console.error('Error loading governing bodies contacts from Firestore:', error);
          resolve([]); // Return an empty array if there is an error
        }
      );
    });
  }

  /**
   * Helper method to load governing bodies contacts from a JSON file.
   * governing bodies contacts are loaded from a JSON file and saved to Firestore or Local Storage depending on the environment.
   *
   * @param missingRoles - An array of roles for which contacts are missing.
   * @returns Promise<Contact[]> - A promise that resolves to an array of governing bodies contacts loaded from JSON.
   */
  private async loadContactsFromJSON(missingRoles: string[]): Promise<Contact[]> {
    return new Promise<Contact[]>((resolve, reject) => {
      this.http.get<Contact[]>('assets/data/governingBodiesContacts.json').subscribe(
        (data) => {
          // Filter governing bodies contacts based on the missing roles
          const filteredContacts = data.filter(contact => missingRoles.includes(contact.role));

          // Set the default image for contacts without an image
          const contactsWithDefaultImage = filteredContacts.map(contact => ({
            ...contact, // Spread the existing contact properties
            image: contact.image || 'assets/images/governingBodiesContacts/generic-user.jpg' // Set default image
          }));

          resolve(contactsWithDefaultImage); // Resolve with the updated contacts
        },
        (error) => {
          console.error('Error loading governing bodies contacts from JSON:', error);
          reject([]);  // Return an empty array on error
        }
      );
    });
  }

  /**
   * Opens a dialog for editing the selected contact.
   * The dialog allows the user to edit the governing bodies contact details and saves the changes if confirmed.
   *
   * @param contact - The governing bodies contact object to be edited
   * @return void
   */
  openEditDialog(contact: Contact): void {
    if (this.isAdminRoute) {
      const dialogRef = this.dialog.open(EditGoverningBodiesContactDialogComponent, {
        width: '300px',
        data: { ...contact }  // Pass a copy of the governing bodies contact data to the dialog
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          // Update the governing bodies contact if changes were made
          const index = this.contacts.findIndex(c => c.role === contact.role);
          if (index > -1) {
            this.contacts[index] = result;

            // Save the updated governing bodies contact based on the environment
            if (environment.production) {
              // Save to Firestore in production
              await this.governingBodiesService.setContact(result.role, result);
            } else {
              // Save to Local Storage in development
              await this.governingBodiesService.setContact(result.role, result);
            }
          }
        }
      });
    }
  }

  /**
   * Checks if a contact is a member of a specified group.
   *
   * @param group - The group to check membership against
   * @param contact - The governing bodies contact to check
   * @returns boolean - True if the contact is a member of the group, otherwise false
   */
  public isContactMemberOfGroup(group: string, contact: Contact): boolean {
    return contact.role.includes(group);
  }
}
