import { TestBed } from '@angular/core/testing';

import { UpgradesService } from './upgrades.service';

describe('UpgradesService', () => {
  let service: UpgradesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpgradesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
