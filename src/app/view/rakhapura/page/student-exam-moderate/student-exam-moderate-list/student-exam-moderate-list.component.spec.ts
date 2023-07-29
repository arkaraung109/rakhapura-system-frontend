import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamModerateListComponent } from './student-exam-moderate-list.component';

describe('StudentExamModerateListComponent', () => {
  let component: StudentExamModerateListComponent;
  let fixture: ComponentFixture<StudentExamModerateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentExamModerateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExamModerateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
