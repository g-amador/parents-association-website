import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditOrganizationContactDialogComponent } from './edit-organization-contact-dialog/edit-organization-contact-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  sidebarVisible = true; // Default to true, will adjust based on screen size

  contacts: any = {
    direction: [],
    assembly: [],
    fiscalCouncil: []
  };

  isAdminRoute: boolean = false;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService) { }

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
    if (this.isAdminRoute) {
      const dialogRef = this.dialog.open(EditOrganizationContactDialogComponent, {
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
