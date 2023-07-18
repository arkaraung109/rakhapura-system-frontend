import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHostelComponent } from './student-hostel.component';

describe('StudentHostelComponent', () => {
  let component: StudentHostelComponent;
  let fixture: ComponentFixture<StudentHostelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentHostelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentHostelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
