import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  sidebarVisible = true;
  selectedLink: string | null = null;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  changeColor(selected: string) {
    this.selectedLink = selected;
  }
}
