import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('Checking authentication...');
    if (this.authService.isAuthenticated()) {
      return true; // User is authenticated, allow access
    } else {
      console.log('User not authenticated, redirecting to login...');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false; // Deny access
    }
  }
}
