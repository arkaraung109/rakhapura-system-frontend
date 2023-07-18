import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHostelEditComponent } from './student-hostel-edit.component';

describe('StudentHostelEditComponent', () => {
  let component: StudentHostelEditComponent;
  let fixture: ComponentFixture<StudentHostelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentHostelEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentHostelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
