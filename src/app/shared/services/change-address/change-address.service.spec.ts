import { TestBed } from '@angular/core/testing';

import { ChangeAddressService } from './change-address.service';

describe('ChangeAddressService', () => {
  let service: ChangeAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
