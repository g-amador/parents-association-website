import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeAMemberComponent } from './be-a-member.component';

describe('BeAMemberComponent', () => {
  let component: BeAMemberComponent;
  let fixture: ComponentFixture<BeAMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeAMemberComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BeAMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
