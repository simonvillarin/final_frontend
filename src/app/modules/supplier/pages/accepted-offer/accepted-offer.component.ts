import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';

@Component({
  selector: 'app-accepted-offer',
  templateUrl: './accepted-offer.component.html',
  styleUrls: ['./accepted-offer.component.scss'],
})
export class AcceptedOfferComponent {
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
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTransactionsBySupplierId();
  }

  getTransactionsBySupplierId = () => {
    this.transactionService
      .getTransactionBySupplierId(this.authService.getUserId())
      .subscribe((data: any) => {
        this.acceptedOffers = data.sort(
          (a: any, b: any) => b.transactionId - a.transactionId
        );
        console.log(data);
      });
  };

  onClear = () => {
    this.categorySelected = '';
  };

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
    }
  };

  onPageChange = (page: any) => {
    this.page = page.page;
    this.categorySelected = '';
  };

  onCancelConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onConfirm = () => {};

  onViewTransaction = (id: any) => {
    this.router.navigate([`/supplier/transaction/${id}`]);
  };
}
