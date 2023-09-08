import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AcceptedOfferCountService {
  acceptedOfferCount: Subject<number> = new Subject<number>();

  setAcceptedOffer = (acceptedOffer: number) => {
    this.acceptedOfferCount.next(acceptedOffer);
  };

  constructor() {}
}
