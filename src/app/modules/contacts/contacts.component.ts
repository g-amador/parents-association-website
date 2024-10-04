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
  sidebarVisible = true;
  contacts: Contact[] = [];
  isAdminRoute: boolean = false;

  private contactService: LocalStorageService | FirestoreService; // Dynamic service based on environment

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

  ngOnInit() {
    this.adjustSidebarVisibility();
    this.loadContacts();

    this.route.data.subscribe(data => {
      this.isAdminRoute = this.authService.isAuthenticated();
    });
  }

  adjustSidebarVisibility() {
    this.sidebarVisible = window.innerWidth > 768; // Adjust the breakpoint as needed
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  async loadContacts() {
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
        this.contacts = loadedContacts;
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Optionally load from JSON in case of error
      await this.loadContactsFromJSON();
    }
  }

  // Helper method to load contacts from Firestore
  private async loadContactsFromFirestore(): Promise<Contact[]> {
    return new Promise<Contact[]>((resolve, reject) => {
      this.contactService.getAllContacts().subscribe(
        (data: Contact[]) => {
          resolve(data);
        },
        (error) => {
          console.error('Error loading contacts from Firestore:', error);
          resolve([]); // Return an empty array if there is an error
        }
      );
    });
  }

  // Helper method to load contacts from Local Storage
  private async loadContactsFromLocalStorage(): Promise<Contact[]> {
    const storedContacts: Contact[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('contact-')) {
        const role = key.replace('contact-', '');
        const contact = await this.contactService.getContact(role);
        if (contact) {
          storedContacts.push(contact);
        }
      }
    }
    return storedContacts;
  }

  // Helper method to load contacts from JSON file
  private async loadContactsFromJSON(): Promise<void> {
    this.http.get<Contact[]>('assets/data/contacts.json').subscribe(
      async (data) => {
        this.contacts = data;
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

  // Open the dialog to edit a contact
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
