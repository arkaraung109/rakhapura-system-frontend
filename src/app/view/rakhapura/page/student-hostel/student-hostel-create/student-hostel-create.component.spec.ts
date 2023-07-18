import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHostelCreateComponent } from './student-hostel-create.component';

describe('StudentHostelCreateComponent', () => {
  let component: StudentHostelCreateComponent;
  let fixture: ComponentFixture<StudentHostelCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentHostelCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentHostelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
