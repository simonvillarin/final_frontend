import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';

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
    private transactionService: TransactionService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getOffersBySupplierId();
  }

  getOffersBySupplierId = () => {
    const param = this.route.snapshot.params['id'];

    this.offerService.getOfferByPostId(param).subscribe(
      (data: any) => {
        this.tempOffers = data.sort((a: any, b: any) => b.offerId - a.offerId);
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
    this.getOffersBySupplierId();
  };

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
      const param = this.route.snapshot.params['id'];
      this.offerService.getOfferByPostId(param).subscribe(
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

  onAcceptOffer = (offer: any) => {
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
      supplierId: this.authService.getUserId(),
      farmerId: this.offer.farmer.userId,
      offerId: this.offer.offerId,
    };
    this.transactionService.addTransaction(payload).subscribe(
      () => {
        const payload1 = {
          isAccepted: true,
        };
        this.offerService
          .updateOffer(this.offer.offerId, payload1)
          .subscribe(() => {
            this.getOffersBySupplierId();
            this.confirmationDialog = false;
          });
      },
      () => {
        this.authService.logout();
      }
    );
  };

  onBack = () => {
    history.back();
  };
}
