import { TestBed } from '@angular/core/testing';

import { GlobalMoneyServiceService } from './global-money-service.service';

describe('GlobalMoneyServiceService', () => {
  let service: GlobalMoneyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMoneyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
