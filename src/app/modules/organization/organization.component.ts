import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditOrganizationContactDialogComponent } from './edit-organization-contact-dialog/edit-organization-contact-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service'; // Import LocalStorageService
import { FirestoreService } from '../../core/services/firestore.service'; // Import FirestoreService
import { Contact } from '../../shared/models/contact.model'; // Import the Contact model
import { environment } from '../../../environments/environment'; // Import environment config

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
    private localStorageService: LocalStorageService, // Inject LocalStorageService
    private firestoreService: FirestoreService // Inject FirestoreService
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

  // Load contacts from either LocalStorageService (dev) or FirestoreService (prod)
  async loadContacts() {
    try {
      // Initialize empty arrays for each contact type
      this.contacts = {
        direction: [] as Contact[],
        assembly: [] as Contact[],
        fiscalCouncil: [] as Contact[]
      };

      // Depending on the environment, load contacts from local storage or Firestore
      if (environment.useLocalStorage) {
        await this.loadContactsFromLocalStorage();
      } else {
        await this.loadContactsFromFirestore();
      }

      // If any contact category is still missing, load from JSON
      await this.loadMissingContactsFromJSON();

    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  // Helper function to load contacts from LocalStorage
  async loadContactsFromLocalStorage() {
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

  // Helper function to load contacts from Firestore
  async loadContactsFromFirestore() {
    // Check for Direction contacts in Firestore
    const storedDirection = await this.firestoreService.getContact('Direction');
    if (storedDirection) {
      this.contacts.direction = [storedDirection]; // Assuming Firestore returns an array or object
    }

    // Check for Assembly contacts in Firestore
    const storedAssembly = await this.firestoreService.getContact('Assembly');
    if (storedAssembly) {
      this.contacts.assembly = [storedAssembly];
    }

    // Check for Fiscal Council contacts in Firestore
    const storedFiscalCouncil = await this.firestoreService.getContact('Fiscal Council');
    if (storedFiscalCouncil) {
      this.contacts.fiscalCouncil = [storedFiscalCouncil];
    }
  }

  // Helper function to load missing contacts from JSON file
  async loadMissingContactsFromJSON() {
    // Flags to determine which contact types are missing
    const missingDirection = this.contacts.direction.length === 0;
    const missingAssembly = this.contacts.assembly.length === 0;
    const missingFiscalCouncil = this.contacts.fiscalCouncil.length === 0;

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

        // Save to local storage or Firestore
        if (environment.useLocalStorage) {
          localStorage.setItem('contact-Direction', JSON.stringify(this.contacts.direction));
        } else {
          await this.firestoreService.setContact('Direction', this.contacts.direction);
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
          await this.firestoreService.setContact('Assembly', this.contacts.assembly);
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
          await this.firestoreService.setContact('Fiscal Council', this.contacts.fiscalCouncil);
        }
      }
    }
  }

  // Save contacts to LocalStorage or Firestore based on the environment
  async saveContacts() {
    try {
      if (environment.useLocalStorage) {
        // Save to local storage
        await this.localStorageService.setContact('Direction', this.contacts.direction);
        await this.localStorageService.setContact('Assembly', this.contacts.assembly);
        await this.localStorageService.setContact('Fiscal Council', this.contacts.fiscalCouncil);
      } else {
        // Save to Firestore
        await this.firestoreService.setContact('Direction', this.contacts.direction);
        await this.firestoreService.setContact('Assembly', this.contacts.assembly);
        await this.firestoreService.setContact('Fiscal Council', this.contacts.fiscalCouncil);
      }
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
