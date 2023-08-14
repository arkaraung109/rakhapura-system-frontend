import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunishmentComponent } from './punishment.component';

describe('PunishmentComponent', () => {
  let component: PunishmentComponent;
  let fixture: ComponentFixture<PunishmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PunishmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
