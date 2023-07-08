import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelEditComponent } from './hostel-edit.component';

describe('HostelEditComponent', () => {
  let component: HostelEditComponent;
  let fixture: ComponentFixture<HostelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
