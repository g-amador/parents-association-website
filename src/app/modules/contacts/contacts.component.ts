import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service'; // Import FirestoreService
import { LocalStorageService } from '../../core/services/local-storage.service'; // Keep LocalStorageService
import { Contact } from '../../shared/models/contact.model';
import { EditContactDialogComponent } from '../contacts/edit-contact-dialog/edit-contact-dialog.component';
import { environment } from '../../../environments/environment';  // Import environment

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  sidebarVisible = true; // Controls the visibility of the sidebar
  contacts: Contact[] = []; // Array to store the list of contacts
  isAdminRoute: boolean = false; // Flag to check if the route is admin

  private contactService: LocalStorageService | FirestoreService; // Dynamic service based on environment

  /**
   * Constructor for the ContactsComponent.
   *
   * @param http - The HttpClient service for making HTTP requests.
   * @param route - The ActivatedRoute service for accessing route data.
   * @param authService - The AuthService to check user authentication.
   * @param firestoreService - The FirestoreService to manage Firestore interactions.
   * @param localStorageService - The LocalStorageService for local storage interactions.
   * @param dialog - The MatDialog service for opening dialogs.
   */
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) {
    // Decide which service to use based on environment
    this.contactService = environment.production && !environment.useLocalStorage
      ? this.firestoreService
      : this.localStorageService;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Initializes the sidebar visibility and loads the contacts.
   */
  ngOnInit(): void {
    this.adjustSidebarVisibility(); // Adjust sidebar visibility based on window width
    this.loadContacts(); // Load contacts from the appropriate source

    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated(); // Check if the user is authenticated
    });
  }

  /**
   * Adjust the visibility of the sidebar based on the window width.
   * Sidebar will be visible if the window is wider than a certain breakpoint.
   */
  adjustSidebarVisibility(): void {
    this.sidebarVisible = window.innerWidth > 768; // Adjust the breakpoint as needed
  }

  /**
   * Load the contacts from the appropriate source depending on the environment.
   * It first attempts to load from Firestore or Local Storage and falls back to JSON if no contacts are found.
   */
  async loadContacts(): Promise<void> {
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
        "contacts_page.coordinator",
        "contacts_page.parents_association",
        "contacts_page.president_parents_association",
        "contacts_page.school_general_and_1st_year",
        "contacts_page.school_ji",
        "contacts_page.marrocos_farm",
        "contacts_page.marrocos_farm_secretary",
        "contacts_page.education_office_jfb",
        "contacts_page.education_manager",
        "contacts_page.aec_coordination",
        "contacts_page.safe_coordination",
        "contacts_page.aaaf_caf_coordination",
        "contacts_page.aaaf_caf",
        "contacts_page.aaaf_caf_contact_monitors"
      ];

      // Step 3: Filter contacts that already exist in local storage or Firestore
      const existingRoles = loadedContacts.map(contact => contact.role);
      const missingRoles = rolesToCheck.filter(role => !existingRoles.includes(role));

      // Step 4: Load missing roles from JSON if needed
      if (missingRoles.length > 0) {
        console.log('Missing contacts found. Loading from JSON...', missingRoles);

        // Load missing contacts from JSON based on missing roles
        const contactsFromJson = await this.loadContactsFromJSON(missingRoles);

        // Add loaded contacts from JSON to the main contacts list and save to storage
        for (const contact of contactsFromJson) {
          loadedContacts.push(contact);  // Add newly loaded contact to the main list

          await this.contactService.setContact(contact.role, contact);  // Save to Firestore in production
        }
      } else {
        console.log('All required contacts are already loaded.');
      }

      // Step 5: Sort the contacts based on rolesToCheck order
      const sortedContacts = rolesToCheck
        .map(role => loadedContacts.find(contact => contact.role === role))
        .filter(contact => contact !== undefined) as Contact[]; // Ensure all contacts are defined

      this.contacts = sortedContacts; // Set the loaded contacts in sorted order
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  /**
   * Helper method to load contacts from Firestore.
   *
   * @returns A promise that resolves to an array of contacts loaded from Firestore.
   */
  private async loadContactsFromFirestore(): Promise<Contact[]> {
    return new Promise<Contact[]>((resolve, reject) => {
      this.contactService.getAllContacts().subscribe(
        (data: Contact[]) => {
          resolve(data); // Resolve with loaded contacts
        },
        (error) => {
          console.error('Error loading contacts from Firestore:', error);
          resolve([]); // Return an empty array if there is an error
        }
      );
    });
  }

  /**
   * Helper method to load contacts from Local Storage.
   *
   * @returns A promise that resolves to an array of contacts loaded from Local Storage.
   */
  private async loadContactsFromLocalStorage(): Promise<Contact[]> {
    const storedContacts: Contact[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('contact-')) {
        const role = key.replace('contact-', '');
        const contact = await this.contactService.getContact(role);
        if (contact) {
          storedContacts.push(contact); // Add contact to the stored contacts array
        }
      }
    }
    return storedContacts;
  }

  /**
   * Helper method to load contacts from a JSON file.
   * Contacts are loaded from a JSON file and saved to Firestore or Local Storage depending on the environment.
   */
  private async loadContactsFromJSON(missingRoles: string[]): Promise<Contact[]> {
    return new Promise<Contact[]>((resolve, reject) => {
      this.http.get<Contact[]>('assets/data/contacts.json').subscribe(
        (data) => {
          // Filter contacts based on the missing roles
          const filteredContacts = data.filter(contact => missingRoles.includes(contact.role));
          resolve(filteredContacts);
        },
        (error) => {
          console.error('Error loading contacts from JSON:', error);
          reject([]);  // Return an empty array on error
        }
      );
    });
  }

  /**
   * Open the dialog to edit a contact.
   *
   * @param contact - The contact to be edited.
   */
  openEditDialog(contact: Contact): void {
    if (this.isAdminRoute) {
      const dialogRef = this.dialog.open(EditContactDialogComponent, {
        width: '300px',
        data: { ...contact }  // Pass a copy of the contact data to the dialog
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          // Update the contact if changes were made
          const index = this.contacts.findIndex(c => c.role === contact.role);
          if (index > -1) {
            this.contacts[index] = result;

            // Save the updated contact based on the environment
            if (environment.production) {
              // Save to Firestore in production
              await this.contactService.setContact(result.role, result);
            } else {
              // Save to Local Storage in development
              await this.contactService.setContact(result.role, result);
            }
          }
        }
      });
    }
  }

  /**
   * Toggle the visibility of the sidebar.
   *
   * @param sidebarVisible - Boolean flag to show or hide the sidebar.
   */
  public toggleSidebarVisibility(sidebarVisible: boolean): void {
    this.sidebarVisible = sidebarVisible;
  }
}
