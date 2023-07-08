import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicYearEditComponent } from './academic-year-edit.component';

describe('AcademicYearEditComponent', () => {
  let component: AcademicYearEditComponent;
  let fixture: ComponentFixture<AcademicYearEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicYearEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicYearEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
