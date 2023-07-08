import { TestBed } from '@angular/core/testing';

import { ExamSubjectService } from './exam-subject.service';

describe('ExamSubjectService', () => {
  let service: ExamSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
