import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunishmentCreateComponent } from './punishment-create.component';

describe('PunishmentCreateComponent', () => {
  let component: PunishmentCreateComponent;
  let fixture: ComponentFixture<PunishmentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PunishmentCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunishmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
