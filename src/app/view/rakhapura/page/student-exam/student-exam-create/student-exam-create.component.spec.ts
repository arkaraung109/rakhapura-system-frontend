import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamCreateComponent } from './student-exam-create.component';

describe('StudentExamCreateComponent', () => {
  let component: StudentExamCreateComponent;
  let fixture: ComponentFixture<StudentExamCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentExamCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExamCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
