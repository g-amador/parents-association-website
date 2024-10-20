import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent {
  recoveryPassword: string = ''; // Recovery password input
  recoveryVerified = false; // Flag to track if recovery password is valid
  email: string = ''; // Email input for new password
  newPassword: string = ''; // New password input
  newPasswordSet = false; // Flag to track if new password is set
  recoveryInvalid = false; // Error for invalid recovery password
  emailInvalid = false; // Error for invalid email

  constructor(private authService: AuthService, private router: Router) { }

  // Verifies the recovery password and email
  async onSubmitRecovery() {
    this.recoveryInvalid = false;
    this.emailInvalid = false;

    // Validate email
    const user = this.authService.findUserByEmail(this.email);
    if (!user) {
      this.emailInvalid = true; // Set error for invalid email
      return; // Exit the function early
    }

    // Verify the recovery password
    const isValid = await this.authService.verifyRecoveryPassword(this.email, this.recoveryPassword);
    if (isValid) {
      this.recoveryVerified = true;
    } else {
      this.recoveryInvalid = true; // Set error for invalid recovery password
    }
  }

  // Sets a new password if recovery is verified
  async onSetNewPassword() {
    if (!this.email) {
      alert('Please provide a valid email.');
      return;
    }

    const success = await this.authService.setNewPasswordWithRecovery(this.email, this.newPassword);
    if (success) {
      this.newPasswordSet = true; // Password successfully updated
      setTimeout(() => this.router.navigate(['/auth/login']), 2000);
    } else {
      alert('Failed to set new password. Please try again.');
    }
  }
}
