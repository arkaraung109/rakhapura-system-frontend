import { TestBed } from '@angular/core/testing';

import { PublicExamResultService } from './public-exam-result.service';

describe('PublicExamResultService', () => {
  let service: PublicExamResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicExamResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
