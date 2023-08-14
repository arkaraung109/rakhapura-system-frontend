import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardEditComponent } from './award-edit.component';

describe('AwardEditComponent', () => {
  let component: AwardEditComponent;
  let fixture: ComponentFixture<AwardEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwardEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
