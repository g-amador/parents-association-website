import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { FirestoreService } from './firestore.service';

/**
 * AuthService is responsible for managing user authentication, including login, logout,
 * session management, and password recovery. It uses either LocalStorage or Firestore
 * based on the application's environment.
 *
 * @class AuthService
 * @example
 * const authService = new AuthService(router, firestore, localStorageService);
 * authService.login(email, password);
 *
 * @see {@link https://angular.io/api/core/Injectable} for Angular's Injectable decorator.
 * @see {@link https://firebase.google.com/docs/firestore} for Firestore documentation.
 *
 * @module AuthServiceModule
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Key to store session data in LocalStorage or Firestore
  private sessionKey = 'session';

  // Duration for session timeout in milliseconds (1 hour)
  private sessionTimeout = 3600 * 1000;

  // Hardcoded users for demonstration (email, hashed password, recovery password)
  private users = [
    {
      email: 'sandrina.vln@gmail.com',
      password: '94e778367a46645e4983cd601250878cd1b52898eaf5b87931df4965499a7aa0',
      recoveryPassword: 'cfcca858254bb077157938180bbe7c778386377f208778528cbacf45e4e392bb',
    },
    {
      email: 'g.n.p.amador@gmail.com',
      password: 'c01e3c64bba84b237b505e601247050c5062bbb6b7bf95eb7ce83b465d32d812',
      recoveryPassword: 'cfcca858254bb077157938180bbe7c778386377f208778528cbacf45e4e392bb',
    },
  ];

  // Storage service which points to either LocalStorage or Firestore based on environment
  private storageService: LocalStorageService | FirestoreService;

  /**
   * Constructs an instance of AuthService.
   * @param {Router} router - Angular Router to handle navigation.
   * @param {AngularFirestore} firestore - Firestore instance for database operations.
   * @param {LocalStorageService} localStorageService - Service to handle LocalStorage operations.
   */
  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private localStorageService: LocalStorageService
  ) {
    // Choose the appropriate storage service based on environment
    this.storageService =
      environment.production ? new FirestoreService(firestore) : localStorageService;
  }

  /**
   * Logs in a user with the provided email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<boolean>} - Returns true if login is successful, otherwise false.
   */
  async login(email: string, password: string): Promise<boolean> {
    const hashedPasswordInput = await this.hashPassword(password);
    const user = this.users.find(
      (u) => u.email === email && u.password === hashedPasswordInput
    );

    if (user) {
      // Store user session with login time
      const session = { email, loginTime: new Date().getTime() };
      await this.storageService.setItem(this.sessionKey, session);
      return true;
    }
    return false;
  }

  /**
   * Checks if the user is authenticated based on the session data.
   * @returns {boolean} - Returns true if the user is authenticated, otherwise false.
   */
  isAuthenticated(): boolean {
    const session = this.storageService.getItem(this.sessionKey);
    if (!session) return false;

    const now = new Date().getTime();

    // Check if session has expired
    if (now - session.loginTime > this.sessionTimeout) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Logs out the user and clears the session data.
   * Redirects to the home page after logout.
   * @returns {Promise<void>} - A promise that resolves when the logout is complete.
   */
  async logout(): Promise<void> {
    await this.storageService.deleteItem(this.sessionKey);
    this.router.navigate(['/home']); // Redirect to home page after logout
  }

  /**
   * Hashes the provided password using SHA-256.
   * @param {string} password - The password to hash.
   * @returns {Promise<string>} - Returns the hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Finds a user by their email address for recovery.
   * @param {string} email - The user's email address.
   * @returns {any} - Returns the user object if found, otherwise undefined.
   */
  findUserByEmail(email: string): any {
    return this.users.find((user) => user.email === email);
  }

  /**
   * Verifies the recovery password for a given email.
   * @param {string} email - The user's email address.
   * @param {string} recoveryPassword - The recovery password to verify.
   * @returns {Promise<boolean>} - Returns true if the recovery password is valid, otherwise false.
   */
  async verifyRecoveryPassword(email: string, recoveryPassword: string): Promise<boolean> {
    const user = this.findUserByEmail(email);
    if (!user) return false;

    const hashedRecoveryPassword = await this.hashPassword(recoveryPassword);
    return hashedRecoveryPassword === user.recoveryPassword;
  }

  /**
   * Sets a new password for the user using their recovery information.
   * @param {string} email - The user's email address.
   * @param {string} newPassword - The new password to set.
   * @returns {Promise<boolean>} - Returns true if the password was successfully updated, otherwise false.
   */
  async setNewPasswordWithRecovery(email: string, newPassword: string): Promise<boolean> {
    const user = this.findUserByEmail(email);
    if (!user) return false;

    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword; // Update the user's password with the new hashed password

    return true;
  }
}

