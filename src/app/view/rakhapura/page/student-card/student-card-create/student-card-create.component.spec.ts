import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCardCreateComponent } from './student-card-create.component';

describe('StudentCardCreateComponent', () => {
  let component: StudentCardCreateComponent;
  let fixture: ComponentFixture<StudentCardCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCardCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCardCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
