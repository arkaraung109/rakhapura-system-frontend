import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSubjectEditComponent } from './exam-subject-edit.component';

describe('ExamSubjectEditComponent', () => {
  let component: ExamSubjectEditComponent;
  let fixture: ComponentFixture<ExamSubjectEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamSubjectEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSubjectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
