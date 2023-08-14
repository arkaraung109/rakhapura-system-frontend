import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunishmentListComponent } from './punishment-list.component';

describe('PunishmentListComponent', () => {
  let component: PunishmentListComponent;
  let fixture: ComponentFixture<PunishmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PunishmentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunishmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
