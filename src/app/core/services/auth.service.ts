import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private sessionKey = 'userSession'; // Key for localStorage to track session
  private sessionTimeout = 3600 * 1000; // 1 hour session timeout in milliseconds

  private users = [
    { email: 'sandrina.vb@gmail.com', password: '94e778367a46645e4983cd601250878cd1b52898eaf5b87931df4965499a7aa0' },
    { email: 'g.n.p.amador@gmail.com', password: 'c01e3c64bba84b237b505e601247050c5062bbb6b7bf95eb7ce83b465d32d812' },
  ];

  constructor(private router: Router) {}

  async login(email: string, password: string): Promise<boolean> {
    const hashedPasswordInput = await this.hashPassword(password);
    //console.log(`Attempting login for ${email}`);

    const user = this.users.find(u => u.email === email && u.password === hashedPasswordInput);

    if (user) {
      const session = { email, loginTime: new Date().getTime() };
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      //console.log('Login successful!');
      return true;
    } else {
      //console.log('Login failed: Invalid credentials');
      return false;
    }
  }

  isAuthenticated(): boolean {
    const session = localStorage.getItem(this.sessionKey);
    if (!session) {
      //console.log("User not authenticated: No session found");
      return false;
    }

    const sessionObj = JSON.parse(session);
    const now = new Date().getTime();

    if (now - sessionObj.loginTime > this.sessionTimeout) {
      this.logout();
      ////console.log("Session has expired!");
      return false;
    }

    ////console.log("User is authenticated: Session is valid");
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
    //console.log("User logged out.");
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
