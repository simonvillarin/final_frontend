import { TestBed } from '@angular/core/testing';

import { OfferCountService } from './offer-count.service';

describe('OfferCountService', () => {
  let service: OfferCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
