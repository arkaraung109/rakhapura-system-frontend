import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAnotherDialogComponent } from './save-another-dialog.component';

describe('SaveAnotherDialogComponent', () => {
  let component: SaveAnotherDialogComponent;
  let fixture: ComponentFixture<SaveAnotherDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveAnotherDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveAnotherDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
