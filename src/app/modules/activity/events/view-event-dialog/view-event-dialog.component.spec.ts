import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEventDialogComponent } from './view-event-dialog.component';
import { By } from '@angular/platform-browser';

describe('ViewEventDialogComponent', () => {
  let component: ViewEventDialogComponent;
  let fixture: ComponentFixture<ViewEventDialogComponent>;

  const mockEventData = {
    title: 'Test Event Title',
    description: 'This is a test event description.'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEventDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockEventData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the event title and description from the data', () => {
    const titleElement = fixture.debugElement.query(By.css('.event-title')).nativeElement;
    const descriptionElement = fixture.debugElement.query(By.css('.event-description')).nativeElement;

    expect(titleElement.textContent).toContain('Test Event Title');
    expect(descriptionElement.textContent).toContain('This is a test event description.');
  });

  it('should have the correct data injected', () => {
    expect(component.data.title).toBe('Test Event Title');
    expect(component.data.description).toBe('This is a test event description.');
  });
});
