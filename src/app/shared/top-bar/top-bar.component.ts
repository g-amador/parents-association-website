import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  selectedLink: string | null = 'home'; // Default to 'home'

  constructor(private authService: AuthService) { }

  setSelectedLink(link: string): void {
    console.log(link)
    this.selectedLink = link;
    // Optionally, trigger change detection if needed
    // e.g., using ChangeDetectorRef or Angular's change detection system
    // this.changeDetectorRef.detectChanges();  // Uncomment if using ChangeDetectorRef
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
