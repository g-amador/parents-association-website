import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsComponent } from './contacts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { of, throwError, Subject } from 'rxjs';
import { Contact } from '../../shared/models/contact.model';
import { EditContactDialogComponent } from '../contacts/edit-contact-dialog/edit-contact-dialog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockFirestoreService: jasmine.SpyObj<FirestoreService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockContacts: Contact[] = [
    { role: 'developer', name: 'John Doe', email: 'john@example.com' },
    { role: 'designer', name: 'Jane Smith', email: 'jane@example.com' }
  ];

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    mockFirestoreService = jasmine.createSpyObj('FirestoreService', ['getAllContacts', 'setContact']);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getAllContacts', 'setContact']);

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [ContactsComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: FirestoreService, useValue: mockFirestoreService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ActivatedRoute, useValue: { data: of({}) } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ignore unknown elements (like EditContactDialog)
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should adjust sidebar visibility based on window width', () => {
    // Type assertion to 'any' allows us to manipulate window.innerWidth
    (window as any).innerWidth = 800;
    component.adjustSidebarVisibility();
    expect(component.sidebarVisible).toBeTrue();

    (window as any).innerWidth = 500;
    component.adjustSidebarVisibility();
    expect(component.sidebarVisible).toBeFalse();
  });

  it('should load contacts from Firestore in production', async () => {
    spyOnProperty(environment, 'production').and.returnValue(true);
    mockFirestoreService.getAllContacts.and.returnValue(of(mockContacts));

    await component.loadContacts();
    expect(component.contacts).toEqual(mockContacts);
  });

  it('should handle error when loading contacts from Firestore', async () => {
    spyOnProperty(environment, 'production').and.returnValue(true);
    mockFirestoreService.getAllContacts.and.returnValue(throwError('Error'));

    await component.loadContacts();
    expect(component.contacts.length).toBe(0);
  });

  it('should load contacts from Local Storage in development', async () => {
    spyOnProperty(environment, 'production').and.returnValue(false);
    mockLocalStorageService.getAllContacts.and.returnValue(of(mockContacts));

    await component.loadContacts();
    expect(component.contacts).toEqual(mockContacts);
  });

  it('should open the edit dialog and update contact', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    const contactToEdit = mockContacts[0];
    component.contacts = mockContacts;

    // Create a mock dialog reference that returns a Subject for afterClosed()
    const dialogRef = {
      afterClosed: () => new Subject<any>(),
      close: () => { }
    } as unknown as MatDialogRef<EditContactDialogComponent>;

    // Mock the dialog open method to return our dialogRef
    mockDialog.open.and.returnValue(dialogRef);

    // Call the method that opens the dialog
    component.openEditDialog(contactToEdit);

    const afterClosedSubject = dialogRef.afterClosed();
    afterClosedSubject.subscribe(result => {
      if (result) {
        const index = component.contacts.findIndex(c => c.role === contactToEdit.role);
        component.contacts[index] = result; // Update the contact
        expect(component.contacts[index]).toEqual(result); // Verify contact update
      }
    });

    // Simulate closing the dialog with a new contact
    const updatedContact = { ...contactToEdit, name: 'Updated Name' };
    (afterClosedSubject as Subject<any>).next(updatedContact); // Emit the updated contact

    // At this point, we should have updated the contact
    expect(component.contacts[0].name).toBe('Updated Name');
  });

  it('should not open the edit dialog if not an admin', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);
    const contactToEdit = mockContacts[0];

    component.openEditDialog(contactToEdit);
    expect(mockDialog.open).not.toHaveBeenCalled();
  });
});
