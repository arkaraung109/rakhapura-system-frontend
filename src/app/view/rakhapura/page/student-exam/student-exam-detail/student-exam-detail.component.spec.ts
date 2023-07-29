import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamDetailComponent } from './student-exam-detail.component';

describe('StudentExamDetailComponent', () => {
  let component: StudentExamDetailComponent;
  let fixture: ComponentFixture<StudentExamDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentExamDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExamDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
