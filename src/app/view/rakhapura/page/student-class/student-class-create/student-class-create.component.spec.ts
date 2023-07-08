import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassCreateComponent } from './student-class-create.component';

describe('StudentClassCreateComponent', () => {
  let component: StudentClassCreateComponent;
  let fixture: ComponentFixture<StudentClassCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentClassCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentClassCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
