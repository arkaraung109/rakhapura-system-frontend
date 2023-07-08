import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTitleEditComponent } from './exam-title-edit.component';

describe('ExamTitleEditComponent', () => {
  let component: ExamTitleEditComponent;
  let fixture: ComponentFixture<ExamTitleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamTitleEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamTitleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
