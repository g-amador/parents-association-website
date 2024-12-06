import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutesComponent } from './statutes.component';

describe('StatutesComponent', () => {
  let component: StatutesComponent;
  let fixture: ComponentFixture<StatutesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatutesComponent]
    });
    fixture = TestBed.createComponent(StatutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
