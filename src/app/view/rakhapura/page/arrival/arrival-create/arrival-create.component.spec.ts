import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalCreateComponent } from './arrival-create.component';

describe('ArrivalCreateComponent', () => {
  let component: ArrivalCreateComponent;
  let fixture: ComponentFixture<ArrivalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrivalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrivalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
