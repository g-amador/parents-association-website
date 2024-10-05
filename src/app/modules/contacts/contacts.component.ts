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
   * Toggle the visibility of the sidebar.
   * @param sidebarVisible - Boolean value to show or hide the sidebar.
   */
  toggleSidebarVisibility(sidebarVisible: boolean): void {
    this.sidebarVisible = sidebarVisible;
  }

  /**
   * Load the contacts from the appropriate source depending on the environment.
   * It first attempts to load from Firestore or Local Storage and falls back to JSON if no contacts are found.
   */
  async loadContacts(): Promise<void> {
    try {
      let loadedContacts: Contact[] = [];

      if (environment.production) {
        // Use Firestore in production
        const firestoreContacts = await this.loadContactsFromFirestore();
        if (firestoreContacts.length > 0) {
          loadedContacts = firestoreContacts;
        }
      } else {
        // Use Local Storage in development
        const localStorageContacts = await this.loadContactsFromLocalStorage();
        if (localStorageContacts.length > 0) {
          loadedContacts = localStorageContacts;
        }
      }

      // If no contacts were found in Firestore or Local Storage, load from JSON
      if (loadedContacts.length === 0) {
        console.log('No contacts found in Firestore/LocalStorage. Loading from JSON...');
        await this.loadContactsFromJSON();
      } else {
        this.contacts = loadedContacts; // Set the loaded contacts
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Optionally load from JSON in case of error
      await this.loadContactsFromJSON();
    }
  }

  /**
   * Helper method to load contacts from Firestore.
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
  private async loadContactsFromJSON(): Promise<void> {
    this.http.get<Contact[]>('assets/data/contacts.json').subscribe(
      async (data) => {
        this.contacts = data; // Set contacts from JSON data
        // Save the loaded contacts to Firestore or Local Storage depending on the environment
        for (const contact of this.contacts) {
          await this.contactService.setContact(contact.role, contact);
        }
      },
      (error) => {
        console.error('Error loading contacts from JSON:', error);
      }
    );
  }

  /**
   * Open the dialog to edit a contact.
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
}
