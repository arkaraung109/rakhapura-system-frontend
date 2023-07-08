import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicYearCreateComponent } from './academic-year-create.component';

describe('AcademicYearCreateComponent', () => {
  let component: AcademicYearCreateComponent;
  let fixture: ComponentFixture<AcademicYearCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicYearCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicYearCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
