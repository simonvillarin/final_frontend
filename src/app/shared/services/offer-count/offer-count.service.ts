import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfferCountService {
  offerCount: Subject<number> = new Subject<number>();

  setOffer = (offer: number) => {
    this.offerCount.next(offer);
  };

  constructor() {}
}
