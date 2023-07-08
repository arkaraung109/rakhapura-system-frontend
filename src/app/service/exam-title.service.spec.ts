import { TestBed } from '@angular/core/testing';

import { ExamTitleService } from './exam-title.service';

describe('ExamTitleService', () => {
  let service: ExamTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
