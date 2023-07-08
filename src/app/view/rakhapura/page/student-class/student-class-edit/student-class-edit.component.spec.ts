import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassEditComponent } from './student-class-edit.component';

describe('StudentClassEditComponent', () => {
  let component: StudentClassEditComponent;
  let fixture: ComponentFixture<StudentClassEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentClassEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentClassEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
