import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelCreateComponent } from './hostel-create.component';

describe('HostelCreateComponent', () => {
  let component: HostelCreateComponent;
  let fixture: ComponentFixture<HostelCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
