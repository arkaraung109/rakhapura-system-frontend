import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicExamResultComponent } from './public-exam-result.component';

describe('PublicExamResultComponent', () => {
  let component: PublicExamResultComponent;
  let fixture: ComponentFixture<PublicExamResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicExamResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicExamResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
