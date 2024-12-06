import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { FirestoreService } from './firestore.service';
import { User } from '../../shared/models/user.model';

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
  // Key to store session data in LocalStorage
  private sessionKey = 'session';

  // Duration for session timeout in milliseconds (1 hour)
  private sessionTimeout = 3600 * 1000;

  // Hardcoded users (email, hashed password, recovery password)
  private users: any[] = []; // Initialize as an empty array

  /**
   * Constructs an instance of AuthService.
   *
   * @param {HttpClient} http - The HttpClient service for making HTTP requests.
   * @param {Router} router - Angular Router to handle navigation.
   * @param {FirestoreService} firestoreService - Service to handle Firestore operations.
   * @param {LocalStorageService} localStorageService - Service to handle LocalStorage operations.
   */
  constructor(
    private http: HttpClient,
    private router: Router,
    private firestoreService: FirestoreService,
    private localStorageService: LocalStorageService
  ) {
    this.loadUsers(); // Load users on service initialization
  }

  /**
   * Load users from the `users.json` file.
   */
  private loadUsers(): void {
    this.http.get<User[]>('/assets/data/users.json').subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  /**
   * Logs in a user with the provided email and password.
   * If the user is hardcoded and not in Firestore, save the user in Firestore (production only).
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<boolean>} - Returns true if login is successful, otherwise false.
   */
  async login(email: string, password: string): Promise<boolean> {
    const hashedPasswordInput = await this.hashPassword(password);
    let storedPassword: string | null = null;

    if (environment.production) {
      storedPassword = await this.firestoreService.getUserPassword(email);

      // If not found in Firestore, check the hardcoded users
      if (!storedPassword) {
        const user = this.findUserByEmail(email);
        if (user && user.password === hashedPasswordInput) {
          // Store the user in Firestore
          await this.firestoreService.updateUserPassword(email, user.password);
          storedPassword = user.password;
        }
      }
    } else {
      const user = this.findUserByEmail(email);
      storedPassword = user ? user.password : null;
    }

    // Login logic
    if (storedPassword && storedPassword === hashedPasswordInput) {
      const session = { email, loginTime: new Date().getTime() };
      this.localStorageService.setItem(this.sessionKey, session);
      return true;
    }

    return false;
  }

  /**
   * Checks if the user is authenticated based on the session data.
   *
   * @returns {boolean} - Returns true if the user is authenticated, otherwise false.
   */
  isAuthenticated(): boolean {
    // Retrieve the session data using the local storage service
    const session = this.localStorageService.getItem(this.sessionKey);

    // If no session exists, the user is not authenticated
    if (!session) return false;

    const now = new Date().getTime();

    // Check if session has expired
    if (now - session.loginTime > this.sessionTimeout) {
      this.logout(); // Logout the user if the session has expired
      return false;
    }

    return true; // User is authenticated if session is valid
  }

  /**
   * Logs out the user and clears the session data.
   * Redirects to the home page after logout.
   *
   * @returns {void}
   */
  logout(): void {
    this.localStorageService.deleteItem(this.sessionKey);
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
   * Helper function to find a user by email in hardcoded users.
   *
   * @param {string} email - The user's email address.
   * @returns {any} - The user object if found, otherwise null.
   */
  findUserByEmail(email: string): any {
    return this.users.find((user) => user.email === email);
  }

  /**
   * Verifies the recovery password for a given email.
   * Recovery password is hardcoded and always valid.
   *
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
   * Updates the password in Firestore if in production.
   *
   * @param {string} email - The user's email address.
   * @param {string} newPassword - The new password to set.
   * @returns {Promise<boolean>} - Returns true if the password was successfully updated, otherwise false.
   */
  async setNewPasswordWithRecovery(email: string, newPassword: string): Promise<boolean> {
    const user = this.findUserByEmail(email);
    if (!user) return false;

    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword; // Update hardcoded user

    // If in production, update Firestore
    if (environment.production) {
      await this.firestoreService.updateUserPassword(email, hashedPassword);
    }

    return true;
  }
}

