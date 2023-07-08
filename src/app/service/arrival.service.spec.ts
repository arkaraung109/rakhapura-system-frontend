import { TestBed } from '@angular/core/testing';

import { ArrivalService } from './arrival.service';

describe('ArrivalService', () => {
  let service: ArrivalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrivalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
