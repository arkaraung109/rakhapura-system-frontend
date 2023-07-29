import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamModerateComponent } from './student-exam-moderate.component';

describe('StudentExamModerateComponent', () => {
  let component: StudentExamModerateComponent;
  let fixture: ComponentFixture<StudentExamModerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentExamModerateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExamModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
