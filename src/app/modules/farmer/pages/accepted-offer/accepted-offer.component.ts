import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AcceptedOfferCountService } from 'src/app/shared/services/accepted-offer-count/accepted-offer-count.service';
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
  empty = true;
  search = '';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private acceptedOfferCountService: AcceptedOfferCountService,
    private router: Router
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

        this.acceptedOffers.forEach((acceptedOffer: any) => {
          const payload = {
            isViewed: true,
          };
          this.transactionService
            .updateTransaction(acceptedOffer.transactionId, payload)
            .subscribe(() => {
              this.transactionService
                .getTransactionByFarmerId(this.authService.getUserId())
                .subscribe((acceptedOffer: any) => {
                  let count = 0;
                  acceptedOffer.forEach((offer: any) => {
                    if (!offer.isViewed) {
                      count = 0;
                    }
                  });
                  this.acceptedOfferCountService.setAcceptedOffer(count);
                });
            });
        });

        console.log(data);
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

  onViewTransaction = (id: any) => {
    this.router.navigate([`/farmer/accepted-offers/transaction-history/${id}`]);
  };

  onSearchChange = (search: string) => {
    if (search !== '') {
      this.acceptedOffers = this.acceptedOffers.filter(
        (acceptedOffer: any) =>
          acceptedOffer.supplier.firstName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          acceptedOffer.supplier.middleName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          acceptedOffer.supplier.lastName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          acceptedOffer.offer.advertisement.description
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          acceptedOffer.offer.advertisement.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          acceptedOffer.offer.price.toLowerCase().includes(search.toLowerCase())
      );
      if (this.acceptedOffers.length > 0) {
        this.empty = false;
      } else {
        this.empty = true;
      }
    } else {
      this.getAcceptedOffers();
    }
  };
}
