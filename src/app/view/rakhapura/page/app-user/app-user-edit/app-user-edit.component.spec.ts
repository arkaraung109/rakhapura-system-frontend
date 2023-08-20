import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserEditComponent } from './app-user-edit.component';

describe('AppUserEditComponent', () => {
  let component: AppUserEditComponent;
  let fixture: ComponentFixture<AppUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppUserEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
