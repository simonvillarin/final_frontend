import { TestBed } from '@angular/core/testing';

import { AcceptedOfferCountService } from './accepted-offer-count.service';

describe('AcceptedOfferCountService', () => {
  let service: AcceptedOfferCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptedOfferCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
