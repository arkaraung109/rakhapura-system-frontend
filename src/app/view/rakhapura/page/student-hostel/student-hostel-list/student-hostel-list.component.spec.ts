import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHostelListComponent } from './student-hostel-list.component';

describe('StudentHostelListComponent', () => {
  let component: StudentHostelListComponent;
  let fixture: ComponentFixture<StudentHostelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentHostelListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentHostelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
