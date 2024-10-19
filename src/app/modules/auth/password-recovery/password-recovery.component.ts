import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent {
  email: string = '';
  resetRequested = false;
  emailNotFound = false;

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit() {
    this.emailNotFound = false; // Reset error state before submission

    const success = await this.authService.requestPasswordReset(this.email);
    if (success) {
      this.resetRequested = true;
    } else {
      this.emailNotFound = true; // Show error if the email is not found
    }
  }
}
