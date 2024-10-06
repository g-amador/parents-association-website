import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganizationComponent } from './organization.component';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { environment } from '../../../environments/environment';

describe('OrganizationComponent', () => {
  let component: OrganizationComponent;
  let fixture: ComponentFixture<OrganizationComponent>;
  let authServiceMock: any;
  let localStorageServiceMock: any;
  let firestoreServiceMock: any;

  beforeEach(async () => {
    // Mock services for the component
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['setContact']);
    firestoreServiceMock = jasmine.createSpyObj('FirestoreService', ['getContact', 'setContact']);

    await TestBed.configureTestingModule({
      declarations: [OrganizationComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: FirestoreService, useValue: firestoreServiceMock },
        { provide: ActivatedRoute, useValue: { data: of({}) } }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAdminRoute to true if user is authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    expect(component.isAdminRoute).toBeTrue();
  });

  it('should set sidebarVisible to true if window width is greater than 768px', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(800);
    component.adjustSidebarVisibility();
    expect(component.sidebarVisible).toBeTrue();
  });

  it('should set sidebarVisible to false if window width is less than or equal to 768px', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(600);
    component.adjustSidebarVisibility();
    expect(component.sidebarVisible).toBeFalse();
  });

  it('should load contacts from localStorage if environment.useLocalStorage is true', async () => {
    // Mock local storage for environment
    const directionContacts = [{ name: 'John Doe', role: 'Director' }];
    localStorage.setItem('contact-Direction', JSON.stringify(directionContacts));

    environment.useLocalStorage = true;
    await component.loadContactsFromLocalStorage();
    expect(component.contacts.direction.length).toBe(1);
  });

  it('should load contacts from Firestore if environment.useLocalStorage is false', async () => {
    // Mock Firestore service returning a contact
    firestoreServiceMock.getContact.and.returnValue(Promise.resolve({ name: 'Jane Doe', role: 'Manager' }));

    environment.useLocalStorage = false;
    await component.loadContactsFromFirestore();
    expect(component.contacts.direction.length).toBe(1);
  });

  it('should open edit dialog when editContact is called', () => {
    spyOn(component.dialog, 'open').and.callThrough();
    component.editContact({}, 'direction', 0);
    expect(component.dialog.open).toHaveBeenCalled();
  });
});
