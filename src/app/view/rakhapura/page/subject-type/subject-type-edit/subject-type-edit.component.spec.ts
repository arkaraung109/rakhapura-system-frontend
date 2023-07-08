import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectTypeEditComponent } from './subject-type-edit.component';

describe('SubjectTypeEditComponent', () => {
  let component: SubjectTypeEditComponent;
  let fixture: ComponentFixture<SubjectTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectTypeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
