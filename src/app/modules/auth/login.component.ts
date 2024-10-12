import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * LoginComponent handles the user login functionality.
 * It interacts with the AuthService to authenticate users and manage login state.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Track login failure status to display error messages
  loginFailed = false;

  /**
   * Creates an instance of LoginComponent.
   * @param authService - An instance of AuthService to handle authentication logic.
   * @param router - An instance of Router to enable navigation within the application.
   * @param route - An instance of ActivatedRoute to access the current route information.
   */
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  /**
   * Handles the submission of the login form.
   * @param form - The login form data containing user email and password.
   */
  async onSubmit(form: any) {
    this.loginFailed = false; // Reset the login failure status on a new attempt
    console.log('Submitting login form...');

    // Attempt to log in the user with the provided email and password
    const isLoggedIn = await this.authService.login(form.value.email, form.value.password);

    if (isLoggedIn) {
      // Get the return URL from query parameters or default to '/home'
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
      console.log('Login successful! Redirecting to', returnUrl);
      this.router.navigateByUrl(returnUrl); // Redirect to the return URL
    } else {
      // Set login failure status to true if login was unsuccessful
      this.loginFailed = true;
      console.log('Invalid credentials.');
    }
  }
}
