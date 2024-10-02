import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Contact } from '../../shared/models/contact.model';
import { EditContactDialogComponent } from '../contacts/edit-contact-dialog/edit-contact-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  sidebarVisible = true;
  contacts: Contact[] = [];
  isAdminRoute: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) { }

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
      const storedContacts: Contact[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('contact-')) {
          const role = key.replace('contact-', '');
          const contact = await this.localStorageService.getContact(role);
          if (contact) {
            storedContacts.push(contact);
          }
        }
      }

      if (storedContacts.length > 0) {
        this.contacts = storedContacts;
      } else {
        this.http.get<Contact[]>('assets/data/contacts.json').subscribe(
          async (data) => {
            this.contacts = data;
            for (const contact of this.contacts) {
              await this.localStorageService.setContact(contact.role, contact);
            }
          },
          (error) => {
            console.error('Error loading contacts:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
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
            await this.localStorageService.setContact(result.role, result); // Save the updated contact to localStorage
          }
        }
      });
    }
  }
}
