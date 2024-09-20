import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  sidebarVisible = true; // Default to true, will adjust based on screen size

  contacts = [
    { name: 'contacts_page.coordinator', email: 'manuel.grilo@agpm.edu.pt' },
    { name: 'contacts_page.parents_association', email: 'apesalvadorampai@hotmail.com' },
    { name: 'contacts_page.president_parents_association', phone: '(+351) 936 257 567', email: 'sandrina.vb@gmail.com' },
    { name: 'contacts_page.school', phone: '(+351) 217 605 771' },
    { name: 'contacts_page.education_office_jfb', phone: '(+351) 217 123 000', email: 'educacao@jfbenfica.pt' },
    { name: 'contacts_page.education_manager', person: 'Tânia Lopes' },
    { name: 'contacts_page.aec_coordination', person: 'João Batista' },
    { name: 'contacts_page.aaaf_caf_coordination', person: 'Nuno Guimarães' },
    { name: 'contacts_page.safe_coordination', person: 'Gonçalo Fonseca' },
    { name: 'contacts_page.aaaf_caf', phone: '(+351) 925 977 565' },
    { name: 'contacts_page.aaaf_caf_contact_monitors', person: 'Joaquim Pinto, Ligia Gonçalves' }
  ];

  ngOnInit() {
    this.adjustSidebarVisibility();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustSidebarVisibility();
  }

  adjustSidebarVisibility() {
    this.sidebarVisible = window.innerWidth > 768; // Adjust the breakpoint as needed
  }

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }
}
