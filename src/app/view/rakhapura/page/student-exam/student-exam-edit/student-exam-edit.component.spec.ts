import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamEditComponent } from './student-exam-edit.component';

describe('StudentExamEditComponent', () => {
  let component: StudentExamEditComponent;
  let fixture: ComponentFixture<StudentExamEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentExamEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExamEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
