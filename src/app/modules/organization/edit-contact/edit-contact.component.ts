import { Component, OnInit } from '@angular/core';
//import { ContactService } from 'src/app/core/http/contact.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements OnInit {
  contactDetails: any = {};

  //constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    /*
    const contact = localStorage.getItem('editContactDetails');
    if (contact) {
      this.contactDetails = JSON.parse(contact);
    }
    */
    const contactData = localStorage.getItem('editContactDetails');
    this.contactDetails = contactData ? JSON.parse(contactData) : {};
  }

  saveContactChanges(): void {
    /*this.contactService.saveRoleData(this.contactDetails.role, this.contactDetails).subscribe(response => {
      if (response.success) {
        console.log('Contact details saved successfully.');
        window.location.href = 'organization.html';
      } else {
        console.error('Failed to save contact details.');
      }
    });*/
    localStorage.setItem('editContactDetails', JSON.stringify(this.contactDetails));
    window.location.href = '/organization'; // Redirect to organization component
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.contactDetails.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
