import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTitleCreateComponent } from './exam-title-create.component';

describe('ExamTitleCreateComponent', () => {
  let component: ExamTitleCreateComponent;
  let fixture: ComponentFixture<ExamTitleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamTitleCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamTitleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
