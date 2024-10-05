import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditOrganizationContactDialogComponent } from './edit-organization-contact-dialog/edit-organization-contact-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service'; // Import the service
import { Contact } from '../../shared/models/contact.model'; // Import the Contact model

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
    private authService: AuthService,
    private localStorageService: LocalStorageService // Inject the LocalStorageService
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

  // Load contacts from LocalStorageService or the initial JSON file
  async loadContacts() {
    try {
      // Retrieve all contacts from LocalStorageService
      const storedContacts = await this.localStorageService.getAllContacts().toPromise();
      console.log(storedContacts);

      // Initialize empty arrays for each contact type
      this.contacts.direction = [];
      this.contacts.assembly = [];
      this.contacts.fiscalCouncil = [];

      // Check if contacts exist in localStorage
      let hasContacts = false; // Flag to check if we have valid contacts

      // If contacts are available in LocalStorage, use them
      if (storedContacts && storedContacts.length > 0) {
        // Loop through the stored contacts and categorize them
        storedContacts.forEach(contact => {
          if (contact.role && contact.role.includes('Direction')) {
            this.contacts.direction.push(contact);
            hasContacts = true; // Mark that we found at least one Direction contact
          } else if (contact.role && contact.role.includes('Assembly')) {
            this.contacts.assembly.push(contact);
            hasContacts = true; // Mark that we found at least one Assembly contact
          } else if (contact.role && contact.role.includes('Fiscal Council')) {
            this.contacts.fiscalCouncil.push(contact);
            hasContacts = true; // Mark that we found at least one Fiscal Council contact
          }
        });
      }

      // If any of the categories are empty, or no valid contacts were found, load from JSON file
      if (!hasContacts ||
        this.contacts.direction.length === 0 ||
        this.contacts.assembly.length === 0 ||
        this.contacts.fiscalCouncil.length === 0) {
        this.http.get<any>('assets/data/organizationContacts.json').subscribe(data => {
          const members = data.members;

          // Map contacts from the JSON data to the respective arrays
          this.contacts.direction = members.Direction.map((contact: any) => ({
            ...contact,
            image: contact.image || `assets/images/organizationContacts/generic-user.jpg` // Assign default image if not provided
          }));

          this.contacts.assembly = members.Assembly.map((contact: any) => ({
            ...contact,
            image: contact.image || `assets/images/organizationContacts/generic-user.jpg` // Assign default image if not provided
          }));

          this.contacts.fiscalCouncil = members['Fiscal Council'].map((contact: any) => ({
            ...contact,
            image: contact.image || `assets/images/organizationContacts/generic-user.jpg` // Assign default image if not provided
          }));

          // Save to LocalStorageService
          this.saveContacts();
        });
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  // Save contacts to LocalStorageService
  async saveContacts() {
    try {
      await this.localStorageService.setContact('Direction', this.contacts.direction);
      await this.localStorageService.setContact('Assembly', this.contacts.assembly);
      await this.localStorageService.setContact('Fiscal Council', this.contacts.fiscalCouncil);
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  }

  // Open the edit dialog when a contact card is clicked
  editContact(contact: any, group: string, index: number) {
    if (this.isAdminRoute) {
      const dialogRef = this.dialog.open(EditOrganizationContactDialogComponent, {
        width: '400px',
        data: { contact }
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          // If the dialog returned a result, update the contact
          this.contacts[group][index] = result;
          await this.saveContacts(); // Save updated contacts
        }
      });
    }
  }

  // Handle sidebar visibility toggle
  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }
}
