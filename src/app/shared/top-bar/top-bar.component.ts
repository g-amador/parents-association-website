import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  selectedLink: string | null = null;
  selectedSubLink: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe(() => {
      var url_split = this.router.url.split('/');
      this.selectedLink = url_split[1];
      if (url_split.length > 2) {
        this.selectedSubLink = url_split[2];
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
