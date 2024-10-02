import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() sidebarVisible = true;
  @Output() sidebarVisibilityChange = new EventEmitter<boolean>();
  selectedLink: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe(() => {
      this.selectedLink = this.router.url.split('/')[1]; // Get the current route
    });
  }

  toggleSidebar() {
    if (window.innerWidth > 768) {
      this.sidebarVisible = !this.sidebarVisible;
      this.sidebarVisibilityChange.emit(this.sidebarVisible);
    }
  }

  changeColor(selected: string) {
    this.selectedLink = selected;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']); // Redirect to home after logout
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
