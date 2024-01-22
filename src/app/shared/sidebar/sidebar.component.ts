import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() sidebarVisible = true;
  @Output() sidebarVisibilityChange = new EventEmitter<boolean>();
  selectedLink: string | null = null;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.sidebarVisibilityChange.emit(this.sidebarVisible);
  }

  changeColor(selected: string) {
    this.selectedLink = selected;
  }
}
