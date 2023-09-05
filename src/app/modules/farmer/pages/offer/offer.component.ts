import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { SmsService } from 'src/app/shared/services/sms/sms.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent implements OnInit {
  offers: any = [];
  offer: any = {};
  tempOffers: any = [];
  categories = [
    'Food Crops',
    'Feed Crops',
    'Fiber Crops',
    'Oil Crops',
    'Ornamental Crops',
    'Industrial Crops',
  ];

  confirmationDialog = false;

  categorySelected = '';

  page: number = 0;
  totalOffers: number = 0;

  constructor(
    private offerService: OfferService,
    private adService: AdvertisementService,
    private authService: AuthService,
    private smsService: SmsService
  ) {}

  ngOnInit(): void {
    this.getOffersByFarmerId();
  }

  getOffersByFarmerId = () => {
    this.offerService
      .getOfferByFarmerId(this.authService.getUserId())
      .subscribe(
        (data: any) => {
          this.tempOffers = data.sort(
            (a: any, b: any) => b.offerId - a.offerId
          );
          this.tempOffers = this.tempOffers.filter(
            (offer: any) => offer.status === true
          );
          this.totalOffers = this.tempOffers.length;
          this.offers = this.tempOffers.splice(this.page * 5, 5);
        },
        () => {
          this.authService.logout();
        }
      );
  };

  onClear = () => {
    this.categorySelected = '';
    this.getOffersByFarmerId();
  };

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
      this.offerService
        .getOfferByFarmerId(this.authService.getUserId())
        .subscribe(
          (data: any) => {
            this.tempOffers = data.sort(
              (a: any, b: any) => b.offerId - a.offerId
            );
            this.tempOffers = this.tempOffers.filter(
              (offer: any) => offer.status === true
            );
            this.totalOffers = this.tempOffers.length;
            this.offers = this.tempOffers.splice(this.page * 5, 5);
            this.offers = this.offers.filter(
              (offer: any) => offer.advertisement.category === category
            );
          },
          () => {
            this.authService.logout();
          }
        );
    }
  };

  onPageChange = (page: any) => {
    this.page = page.page;
    this.categorySelected = '';
  };

  onCancelOffer = (offer: any) => {
    if (!offer.isAccepted) {
      this.offer = offer;
      this.confirmationDialog = true;
    }
  };

  onCancelConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onConfirm = () => {
    const payload = {
      status: 'false',
    };
    this.offerService.updateOffer(this.offer.offerId, payload).subscribe(
      () => {
        const payload1 = {
          isOffered: false,
        };
        this.adService
          .updateAdvertisement(this.offer.advertisement.postId, payload1)
          .subscribe(() => {
            this.getOffersByFarmerId();
            this.confirmationDialog = false;
          });
      },
      () => {
        this.authService.logout();
      }
    );
  };
}
