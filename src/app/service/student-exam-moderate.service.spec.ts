import { TestBed } from '@angular/core/testing';

import { StudentExamModerateService } from './student-exam-moderate.service';

describe('StudentExamModerateService', () => {
  let service: StudentExamModerateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentExamModerateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
