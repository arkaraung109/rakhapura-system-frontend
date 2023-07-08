import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSubjectListComponent } from './exam-subject-list.component';

describe('ExamSubjectListComponent', () => {
  let component: ExamSubjectListComponent;
  let fixture: ComponentFixture<ExamSubjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamSubjectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
