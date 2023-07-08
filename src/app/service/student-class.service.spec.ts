import { TestBed } from '@angular/core/testing';

import { StudentClassService } from './student-class.service';

describe('StudentClassService', () => {
  let service: StudentClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
