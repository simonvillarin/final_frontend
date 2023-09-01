import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';

@Component({
  selector: 'app-accepted-offer',
  templateUrl: './accepted-offer.component.html',
  styleUrls: ['./accepted-offer.component.scss'],
})
export class AcceptedOfferComponent implements OnInit {
  acceptedOffers: any = [];
  acceptedOffer: any = {};
  tempAcceptedOffers: any = [];
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
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAcceptedOffers();
  }

  getAcceptedOffers = () => {
    this.transactionService
      .getTransactionByFarmerId(this.authService.getUserId())
      .subscribe((data: any) => {
        this.tempAcceptedOffers = data.sort(
          (a: any, b: any) => b.transactionId - a.transactionId
        );
        this.tempAcceptedOffers = this.tempAcceptedOffers.filter(
          (offer: any) => offer.status === true
        );
        this.totalOffers = this.tempAcceptedOffers.length;
        this.acceptedOffers = this.tempAcceptedOffers.splice(this.page * 5, 5);
      });
  };

  onClear = () => {
    this.categorySelected = '';
    this.getAcceptedOffers();
  };

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
      this.transactionService
        .getTransactionByFarmerId(this.authService.getUserId())
        .subscribe((data: any) => {
          this.tempAcceptedOffers = data.sort(
            (a: any, b: any) => b.transactionId - a.transactionId
          );
          this.tempAcceptedOffers = this.tempAcceptedOffers.filter(
            (offer: any) => offer.status === true
          );
          this.totalOffers = this.tempAcceptedOffers.length;
          this.acceptedOffers = this.tempAcceptedOffers.splice(
            this.page * 5,
            5
          );
          this.acceptedOffers = this.acceptedOffers.filter(
            (acceptedOffer: any) =>
              acceptedOffer.offer.advertisement.category === category
          );
        });
    }
  };

  onPageChange = (page: any) => {
    this.page = page.page;
    this.categorySelected = '';
  };
}
