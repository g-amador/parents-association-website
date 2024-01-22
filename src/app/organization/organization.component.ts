import { Component } from '@angular/core';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent {
  sidebarVisible = true;

  toggleSidebarVisibility(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }
}
