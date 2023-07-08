import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSubjectComponent } from './exam-subject.component';

describe('ExamSubjectComponent', () => {
  let component: ExamSubjectComponent;
  let fixture: ComponentFixture<ExamSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
