import { TestBed } from '@angular/core/testing';

import { PunishmentService } from './punishment.service';

describe('PunishmentService', () => {
  let service: PunishmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PunishmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
