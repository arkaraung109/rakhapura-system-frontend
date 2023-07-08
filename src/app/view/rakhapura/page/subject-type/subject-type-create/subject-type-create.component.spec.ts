import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectTypeCreateComponent } from './subject-type-create.component';

describe('SubjectTypeCreateComponent', () => {
  let component: SubjectTypeCreateComponent;
  let fixture: ComponentFixture<SubjectTypeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectTypeCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
