import { Component } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  sidebarVisible = true;

  contacts = [
    { name: 'SCHOOL_COORDINATOR', email: 'manuel.grilo@agpm.edu.pt' },
    { name: 'PARENTS_ASSOCIATION', email: 'apesalvadorampai@hotmail.com' },
    { name: 'PRESIDENT_PARENTS_ASSOCIATION', phone: '(+351) 936 257 567', email: 'sandrina.vb@gmail.com' },
    { name: 'SCHOOL', phone: '(+351) 217 605 771' },
    { name: 'EDUCATION_OFFICE_JFB', phone: '(+351) 217 123 000', email: 'educacao@jfbenfica.pt' },
    { name: 'EDUCATION_MANAGER', person: 'Tânia Lopes' },
    { name: 'AEC_COORDINATION', person: 'João Batista' },
    { name: 'AAAF_CAF_COORDINATION', person: 'Nuno Guimarães' },
    { name: 'SAFE_COORDINATION', person: 'Gonçalo Fonseca' },
    { name: 'AAAF_CAF', phone: '(+351) 925 977 565' },
    { name: 'AAAF_CAF_CONTACT_MONITORS', person: 'Joaquim Pinto, Lúcia Gonçalves' }
  ];

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }
}
