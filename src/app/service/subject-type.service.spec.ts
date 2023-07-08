import { TestBed } from '@angular/core/testing';

import { SubjectTypeService } from './subject-type.service';

describe('SubjectTypeService', () => {
  let service: SubjectTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
