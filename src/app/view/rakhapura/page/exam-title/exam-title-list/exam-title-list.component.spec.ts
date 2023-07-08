import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTitleListComponent } from './exam-title-list.component';

describe('ExamTitleListComponent', () => {
  let component: ExamTitleListComponent;
  let fixture: ComponentFixture<ExamTitleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamTitleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamTitleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
