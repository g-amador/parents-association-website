import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoverningBodiesComponent } from './governing-bodies.component';

describe('GoverningBodiesComponent', () => {
  let component: GoverningBodiesComponent;
  let fixture: ComponentFixture<GoverningBodiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoverningBodiesComponent]
    });
    fixture = TestBed.createComponent(GoverningBodiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
