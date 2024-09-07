import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private rolesDirectory = 'assets/roles/';

  constructor(private http: HttpClient) { }

  getRoleData(role: string): Observable<any> {
    const url = `${this.rolesDirectory}${role}.json`;
    return this.http.get<any>(url);
  }

  saveRoleData(role: string, data: any): Observable<any> {
    // Mock saving to JSON file (since direct writing isn't possible in Angular)
    const url = `${this.rolesDirectory}${role}.json`;
    console.log(`Saving data to ${url}:`, data);

    // Normally you would send this data to a backend server for saving
    return of({ success: true });
  }
}
