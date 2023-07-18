import { TestBed } from '@angular/core/testing';

import { StudentHostelService } from './student-hostel.service';

describe('StudentHostelService', () => {
  let service: StudentHostelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentHostelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
