import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardCreateComponent } from './award-create.component';

describe('AwardCreateComponent', () => {
  let component: AwardCreateComponent;
  let fixture: ComponentFixture<AwardCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwardCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwardCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
