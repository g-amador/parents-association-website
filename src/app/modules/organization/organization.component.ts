import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.http.get<any>('assets/data/roles.json').subscribe(data => {
      const members = data.members;
      this.contacts.direction = members.Direction.map((contact: { image: string; role: string; }) => {
        contact.image = `assets/images/roles/generic-user.jpg` //assets/images/roles/${contact.role.replace(/\s+/g, '-')}.jpeg`;
        return contact;
      });
      this.contacts.assembly = members.Assembly.map((contact: { image: string; role: string; }) => {
        contact.image = `assets/images/roles/generic-user.jpg` //`assets/images/roles/${contact.role.replace(/\s+/g, '-')}.jpeg`;
        return contact;
      });
      this.contacts.fiscalCouncil = members['Fiscal Council'].map((contact: { image: string; role: string; }) => {
        contact.image = `assets/images/roles/generic-user.jpg` //`assets/images/roles/${contact.role.replace(/\s+/g, '-')}.jpeg`;
        return contact;
      });
    });
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }
}
