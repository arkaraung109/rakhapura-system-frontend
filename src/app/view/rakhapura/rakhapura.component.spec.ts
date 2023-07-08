import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RakhapuraComponent } from './rakhapura.component';

describe('RakhapuraComponent', () => {
  let component: RakhapuraComponent;
  let fixture: ComponentFixture<RakhapuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RakhapuraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RakhapuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
