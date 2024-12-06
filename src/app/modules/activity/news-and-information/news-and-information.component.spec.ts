import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAndInformationComponent } from './news-and-information.component';

describe('NewsAndInformationComponent', () => {
  let component: NewsAndInformationComponent;
  let fixture: ComponentFixture<NewsAndInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsAndInformationComponent]
    });
    fixture = TestBed.createComponent(NewsAndInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
