import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunishmentEditComponent } from './punishment-edit.component';

describe('PunishmentEditComponent', () => {
  let component: PunishmentEditComponent;
  let fixture: ComponentFixture<PunishmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PunishmentEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunishmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
