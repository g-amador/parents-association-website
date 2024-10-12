import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * AuthService is a service that handles authentication logic for the application.
 * It provides methods for user login, logout, session management, and password hashing.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Key for localStorage to track session
  private sessionKey = 'userSession';

  // Duration of session timeout in milliseconds (1 hour)
  private sessionTimeout = 3600 * 1000;

  // Sample users for demonstration purposes. In a real application, user data should be retrieved from a secure backend.
  private users = [
    {
      email: 'sandrina.vb@gmail.com',
      password: '94e778367a46645e4983cd601250878cd1b52898eaf5b87931df4965499a7aa0'
    },
    {
      email: 'g.n.p.amador@gmail.com',
      password: 'c01e3c64bba84b237b505e601247050c5062bbb6b7bf95eb7ce83b465d32d812'
    },
    {
      email: 'temp_admin@gmail.com',
      password: '1219190183ef88167ca0ca987480f0bc8599628d8bb769648c429b0daffab57d'
    },
  ];

  /**
   * Creates an instance of AuthService.
   * @param router - An instance of Router to enable navigation within the application.
   */
  constructor(private router: Router) { }

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
      return true; // Login successful
    } else {
      return false; // Login failed due to invalid credentials
    }
  }

  /**
   * Checks if the user is currently authenticated based on the session stored in localStorage.
   * @returns A boolean indicating whether the user is authenticated.
   */
  isAuthenticated(): boolean {
    const session = localStorage.getItem(this.sessionKey);
    if (!session) {
      return false; // No session found, user not authenticated
    }

    const sessionObj = JSON.parse(session);
    const now = new Date().getTime();

    // Check if the session has expired
    if (now - sessionObj.loginTime > this.sessionTimeout) {
      this.logout(); // Logout due to session expiry
      return false;
    }

    return true; // User is authenticated
  }

  /**
   * Logs out the current user by removing their session from localStorage.
   */
  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }

  /**
   * Hashes a given password using SHA-256.
   * @param password - The password to be hashed.
   * @returns A promise that resolves to the hashed password as a hexadecimal string.
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}
