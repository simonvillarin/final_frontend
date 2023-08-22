import { TestBed } from '@angular/core/testing';

import { FarmingTipsService } from './farming-tips.service';

describe('FarmingTipsService', () => {
  let service: FarmingTipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarmingTipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
