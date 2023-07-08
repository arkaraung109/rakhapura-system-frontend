import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicexamresultComponent } from './publicexamresult.component';

describe('PublicexamresultComponent', () => {
  let component: PublicexamresultComponent;
  let fixture: ComponentFixture<PublicexamresultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicexamresultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicexamresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
