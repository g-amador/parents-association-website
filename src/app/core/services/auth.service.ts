import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../../../environments/environment';

/**
 * AuthService is a service that handles authentication logic for the application.
 * It provides methods for user login, logout, session management, and password hashing.
 */@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Key for localStorage to track session
  private sessionKey = 'userSession';

  // Duration of session timeout in milliseconds (1 hour)
  private sessionTimeout = 3600 * 1000; // 1 hour session timeout

  // Sample users for demonstration purposes
  private users = [
    {
      email: 'sandrina.vln@gmail.com',
      password: '94e778367a46645e4983cd601250878cd1b52898eaf5b87931df4965499a7aa0',
      recoveryPassword: 'cfcca858254bb077157938180bbe7c778386377f208778528cbacf45e4e392bb'
    },
    {
      email: 'g.n.p.amador@gmail.com',
      password: 'c01e3c64bba84b237b505e601247050c5062bbb6b7bf95eb7ce83b465d32d812',
      recoveryPassword: 'cfcca858254bb077157938180bbe7c778386377f208778528cbacf45e4e392bb'
    },
  ];

  /**
   * Creates an instance of AuthService.
   * @param router - An instance of Router to enable navigation within the application.
   */
  constructor(private router: Router, private firestore: AngularFirestore) { }

  /**
  * Logs in the user by verifying their email and password.
  * @param email - The user's email address.
  * @param password - The user's password.
  * @returns A promise that resolves to true if the login is successful, otherwise false.
  */
  async login(email: string, password: string): Promise<boolean> {
    const hashedPasswordInput = await this.hashPassword(password);
    const user = this.users.find(u => u.email === email && u.password === hashedPasswordInput);
    if (user) {
      const session = { email, loginTime: new Date().getTime() };
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      return true;
    }
    return false;
  }

  /**
   * Checks if the user is currently authenticated based on the session stored in localStorage.
   * @returns A boolean indicating whether the user is authenticated.
   */
  isAuthenticated(): boolean {
    const session = localStorage.getItem(this.sessionKey);
    if (!session) return false;

    const sessionObj = JSON.parse(session);
    const now = new Date().getTime();

    if (now - sessionObj.loginTime > this.sessionTimeout) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Checks if the user is currently authenticated based on the session stored in localStorage.
   * @returns A boolean indicating whether the user is authenticated.
   */
  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }

  /**
   * Hashes a given password using SHA-256.
   * @param password - The password to be hashed.
   * @returns A promise that resolves to the hashed password as a hexadecimal string.
   */
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  // Finds a user by email
  findUserByEmail(email: string): any {
    return this.users.find(user => user.email === email);
  }

  // Verifies the recovery password
  async verifyRecoveryPassword(email: string, recoveryPassword: string): Promise<boolean> {
    const user = this.findUserByEmail(email);
    if (!user) return false;

    const hashedRecoveryPassword = await this.hashPassword(recoveryPassword);
    return hashedRecoveryPassword === user.recoveryPassword;
  }

  // Sets a new password using the recovery password
  async setNewPasswordWithRecovery(email: string, newPassword: string): Promise<boolean> {
    const user = this.findUserByEmail(email);
    if (!user) return false;

    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword; // Update the user's password with the new hashed password

    return true;
  }
}
