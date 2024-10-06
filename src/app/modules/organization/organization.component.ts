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
      // Initialize empty arrays for each contact type
      this.contacts = {
        direction: [] as Contact[],
        assembly: [] as Contact[],
        fiscalCouncil: [] as Contact[]
      };

      // Flags to determine which contact types are missing in local storage
      let missingDirection = false;
      let missingAssembly = false;
      let missingFiscalCouncil = false;

      // Check for Direction contacts in local storage
      const storedDirection = localStorage.getItem('contact-Direction');
      if (storedDirection) {
        this.contacts.direction = JSON.parse(storedDirection);
      } else {
        missingDirection = true; // Mark to load from JSON if missing
      }

      // Check for Assembly contacts in local storage
      const storedAssembly = localStorage.getItem('contact-Assembly');
      if (storedAssembly) {
        this.contacts.assembly = JSON.parse(storedAssembly);
      } else {
        missingAssembly = true; // Mark to load from JSON if missing
      }

      // Check for Fiscal Council contacts in local storage
      const storedFiscalCouncil = localStorage.getItem('contact-Fiscal Council');
      if (storedFiscalCouncil) {
        this.contacts.fiscalCouncil = JSON.parse(storedFiscalCouncil);
      } else {
        missingFiscalCouncil = true; // Mark to load from JSON if missing
      }

      // If any of the categories are missing, load only the missing ones from JSON
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
          // Save to localStorage
          localStorage.setItem('contact-Direction', JSON.stringify(this.contacts.direction));
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
          // Save to localStorage
          localStorage.setItem('contact-Assembly', JSON.stringify(this.contacts.assembly));
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
          // Save to localStorage
          localStorage.setItem('contact-Fiscal Council', JSON.stringify(this.contacts.fiscalCouncil));
        }
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
