import { Component, OnInit } from '@angular/core';
//import { ContactService } from 'src/app/core/http/contact.service';

interface RoleData {
  role: string;
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
}

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  /*rolesData = [
    { role: 'Secretary', name: 'John Doe', email: 'john@example.com', phoneNumber: '123-456-7890', image: 'assets/images/generic-user.jpg' },
    { role: 'Vice President', name: 'Jane Smith', email: 'jane@example.com', phoneNumber: '987-654-3210', image: 'assets/images/generic-user.jpg' },
    { role: 'President', name: 'Bob Johnson', email: 'bob@example.com', phoneNumber: '555-123-4567', image: 'assets/images/generic-user.jpg' },
    { role: 'Finance Guy', name: 'Alice Brown', email: 'alice@example.com', phoneNumber: '111-222-3333', image: 'assets/images/generic-user.jpg' },
    { role: 'Vowel', name: 'Ella Davis', email: 'ella@example.com', phoneNumber: '444-555-6666', image: 'assets/images/generic-user.jpg' }
  ];*/
  rolesData: RoleData[] = [];
  selectedContact: RoleData | null = null;
  sidebarVisible = true;

  //constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    // Load rolesData from localStorage or use default data
    const storedData = localStorage.getItem('rolesData');
    this.rolesData = storedData ? JSON.parse(storedData) : [
      { role: 'Secretary', name: 'John Doe', email: 'john@example.com', phoneNumber: '123-456-7890', image: 'assets/images/generic-user.jpg' },
      { role: 'Vice President', name: 'Jane Smith', email: 'jane@example.com', phoneNumber: '987-654-3210', image: 'assets/images/generic-user.jpg' },
      { role: 'President', name: 'Bob Johnson', email: 'bob@example.com', phoneNumber: '555-123-4567', image: 'assets/images/generic-user.jpg' },
      { role: 'Finance Guy', name: 'Alice Brown', email: 'alice@example.com', phoneNumber: '111-222-3333', image: 'assets/images/generic-user.jpg' },
      { role: 'Vowel', name: 'Ella Davis', email: 'ella@example.com', phoneNumber: '444-555-6666', image: 'assets/images/generic-user.jpg' }
    ];
    // Load existing roles data
    /*this.rolesData.forEach(role => {
      this.contactService.getRoleData(role.role).subscribe(data => {
        if (data) {
          role.name = data.name;
          role.email = data.email;
          role.phoneNumber = data.phoneNumber;
          role.image = data.image || 'assets/images/generic-user.jpg';
        }
      });
    });*/
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  editContact(index: number): void {
    this.selectedContact = this.rolesData[index];
    localStorage.setItem('editContactDetails', JSON.stringify(this.selectedContact));
    window.location.href = '/edit-contact'; // Redirect to the edit-contact component
  }

  saveContacts(): void {
    /*this.rolesData.forEach(role => {
      this.contactService.saveRoleData(role.role, role).subscribe(response => {
        if (response.success) {
          console.log(`Successfully saved data for role: ${role.role}`);
        } else {
          console.error(`Failed to save data for role: ${role.role}`);
        }
      });
    });*/
    // Save all contact details to local storage or send to the server
    localStorage.setItem('rolesData', JSON.stringify(this.rolesData));
  }

  onFileChange(event: any, index: number): void {
    /*const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.rolesData[index].image = e.target.result;
      };
      reader.readAsDataURL(file);
    }*/
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.rolesData[index].image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
