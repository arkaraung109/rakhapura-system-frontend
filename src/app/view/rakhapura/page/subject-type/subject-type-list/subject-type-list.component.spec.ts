import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectTypeListComponent } from './subject-type-list.component';

describe('SubjectTypeListComponent', () => {
  let component: SubjectTypeListComponent;
  let fixture: ComponentFixture<SubjectTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
