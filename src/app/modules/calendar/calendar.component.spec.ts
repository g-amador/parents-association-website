import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { of } from 'rxjs';
import { Event } from '../../shared/models/event.model';
import { environment } from '../../../environments/environment';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockFirestoreService: jasmine.SpyObj<FirestoreService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getAllEvents', 'setEvent', 'deleteEvent']);
    mockFirestoreService = jasmine.createSpyObj('FirestoreService', ['getAllEvents', 'setEvent', 'deleteEvent']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['data']);

    await TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: AuthService, useValue: mockAuthService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: FirestoreService, useValue: mockFirestoreService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load events from local storage and regenerate calendar', async () => {
    const mockEvents = { '2024-10-01': [{ title: 'Test Event', date: '2024-10-01', description: 'A test event.' }] };
    mockLocalStorageService.getAllEvents.and.returnValue(Promise.resolve(mockEvents));
    environment.useLocalStorage = true; // Set environment for local storage usage

    await component.loadEvents();

    expect(component.events).toEqual(mockEvents);
    expect(component.generateCalendar).toHaveBeenCalled(); // Ensure calendar is regenerated
  });

  it('should load events from Firestore and regenerate calendar', () => {
    const mockEvents: Event[] = [{ title: 'Test Event', date: '2024-10-01', description: 'A test event.' }];
    mockFirestoreService.getAllEvents.and.returnValue(of(mockEvents)); // Return observable from Firestore

    component.loadEvents();

    expect(component.events).toEqual({ '2024-10-01': mockEvents });
    expect(component.generateCalendar).toHaveBeenCalled(); // Ensure calendar is regenerated
  });

  it('should add a new event and regenerate calendar', async () => {
    const newEventData = { title: 'New Event', date: '2024-10-01', description: 'Description' };
    environment.useLocalStorage = true; // Set environment for local storage usage
    await component.addEvent(newEventData);

    expect(component.events['2024-10-01']).toContain(jasmine.objectContaining(newEventData));
    expect(mockLocalStorageService.setEvent).toHaveBeenCalledWith('2024-10-01', jasmine.any(Object)); // Check if setEvent is called
    expect(component.generateCalendar).toHaveBeenCalled(); // Ensure calendar is regenerated
  });

  it('should update an existing event and regenerate calendar', async () => {
    const existingEventData = { title: 'Existing Event', date: '2024-10-01', description: 'Description', index: 0 };
    component.events['2024-10-01'] = [{ title: 'Old Event', date: '2024-10-01', description: 'Old description' }];
    await component.updateEvent(existingEventData);

    expect(component.events['2024-10-01'][0].title).toBe('Existing Event'); // Ensure the title is updated
    expect(mockLocalStorageService.setEvent).toHaveBeenCalledWith('2024-10-01', jasmine.any(Object)); // Check if setEvent is called
    expect(component.generateCalendar).toHaveBeenCalled(); // Ensure calendar is regenerated
  });

  it('should delete an event and regenerate calendar', async () => {
    const date = '2024-10-01';
    component.events[date] = [{ title: 'Event to be deleted', date, description: 'Description' }];
    await component.deleteEvent(date, 0);

    expect(component.events[date]).toBeUndefined(); // Ensure event is deleted
    expect(mockLocalStorageService.deleteEvent).toHaveBeenCalledWith(date); // Check if deleteEvent is called
    expect(component.generateCalendar).toHaveBeenCalled(); // Ensure calendar is regenerated
  });
});
