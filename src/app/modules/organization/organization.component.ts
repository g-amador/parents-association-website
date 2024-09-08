import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditContactDialogComponent } from './edit-contact-dialog/edit-contact-dialog.component'; // Import the dialog component

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  contacts: any = {
    direction: [],
    assembly: [],
    fiscalCouncil: []
  };
  sidebarVisible = true;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadContacts();
  }

  // Load contacts from localStorage or the initial JSON file
  loadContacts() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
    } else {
      this.http.get<any>('assets/data/roles.json').subscribe(data => {
        const members = data.members;
        this.contacts.direction = members.Direction.map((contact: any) => ({
          ...contact,
          image: `assets/images/roles/generic-user.jpg`
        }));
        this.contacts.assembly = members.Assembly.map((contact: any) => ({
          ...contact,
          image: `assets/images/roles/generic-user.jpg`
        }));
        this.contacts.fiscalCouncil = members['Fiscal Council'].map((contact: any) => ({
          ...contact,
          image: `assets/images/roles/generic-user.jpg`
        }));

        this.saveToLocalStorage();
      });
    }
  }

  // Open the edit dialog when a contact card is clicked
  editContact(contact: any, group: string, index: number) {
    const dialogRef = this.dialog.open(EditContactDialogComponent, {
      width: '400px',
      data: { contact }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If the dialog returned a result, update the contact
        this.contacts[group][index] = result;
        this.saveToLocalStorage();
      }
    });
  }

  // Save contacts to localStorage
  saveToLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  // Handle sidebar visibility toggle
  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }
}
