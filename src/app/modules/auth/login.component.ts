import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginFailed = false; // Track login failure status

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  async onSubmit(form: any) {
    this.loginFailed = false; // Reset on new attempt
    console.log('Submitting login form...');

    const isLoggedIn = await this.authService.login(form.value.email, form.value.password);

    if (isLoggedIn) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
      console.log('Login successful! Redirecting to', returnUrl);
      this.router.navigateByUrl(returnUrl); // Redirect to the return URL or default to home
    } else {
      this.loginFailed = true; // Set login failure status
      console.log('Invalid credentials.');
    }
  }
}
