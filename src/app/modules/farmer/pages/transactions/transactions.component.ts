import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { FarmingTipsService } from 'src/app/shared/services/farming-tips/farming-tips.service';
import { MessageService } from 'primeng/api';
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';
import { PaymentDetailsService } from 'src/app/shared/services/payment-details/payment-details.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from 'src/app/shared/services/offer/offer.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  providers: [MessageService],
})
export class TransactionsComponent {
  addDialog = false;
  confirmationDialog = false;
  showImage = false;
  isEditing = false;
  emptyImage = false;
  search = '';
  empty = true;

  paymentForm: FormGroup;

  user: any = {};
  payment: any;
  offers: any = {};
  post: any = {};
  paymentDetails: any;
  suppliers: any;
  paymentAccount: any;

  transactions: any = [];
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private transactionService: TransactionService,
    private advertisementService: AdvertisementService,
    private paymentDetailsService: PaymentDetailsService,
    private userService: UserService,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private offerService: OfferService,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      transactionId: [''],
      paymentAccountId: [''],
      paymentMode: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getTransactionByFarmerId();
    this.getUserById();
    this.getTransactionById();
    this.getPaymentByTransactionId();
    this.getPaymentDetailsByTransactionId();
  }

  getTransactionByFarmerId = () => {
    this.transactionService
    .getTransactionByFarmerId(this.authService.getUserId())
    .subscribe((data: any) => {
      this.transactions = data;
      console.log(data);
    });
  }

  openAddTipDialog = () => {
    this.isEditing = false;
    this.emptyImage = false;
    this.showImage = false;
    this.addDialog = true;
  };

  onEditTip = (tip: any) => {
    this.isEditing = true;
    this.addDialog = true;
  };


 /** onSearchChange = (search: string) => {
    if (search !== '') {
      this.tips = this.tips.filter(
        (tip: any) =>
          tip.tip.toLowerCase().includes(search.toLowerCase()) ||
          tip.subject.toLowerCase().includes(search.toLowerCase())
      );
      if (this.tips.length > 0) {
        this.empty = false;
      } else {
        this.empty = true;
      }
    } else {
      this.getTransactionByFarmerId();
    }
  }; **/

  
  getUserById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data: any) => {
        this.user = data;
        console.log(data);
      });
  };

  getTransactionById = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;
      console.log(data);

      this.paymentForm.patchValue({
        transactionId: this.transactions.transactionId,
      });

      const offerId = data.offerId;
      this.offerService.getOfferById(offerId).subscribe((data: any) => {
        this.offers = data;
        console.log(data);

        const postId = data.postId;
        this.advertisementService.getAdById(postId).subscribe((data: any) => {
          this.post = data;
          console.log(data);
        });
      });

      const supplierId = data.supplierId;
      this.userService.getUserById(supplierId).subscribe((data: any) => {
        this.suppliers = data;
        console.log(data);
      });
    });
  };

  getPaymentByTransactionId = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;
      console.log(data);

      const transactionId = data.transactionId;
      this.paymentService
        .getPaymentByTransactionId(transactionId)
        .subscribe((data) => {
          this.payment = data;
          console.log(data);
        });
    });
  };

  getPaymentDetailsByTransactionId = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;
      console.log(data);

      const transactionId = this.transactions.transactionId;
      this.paymentDetailsService
        .getPaymentDetailsByTransactionId(transactionId)
        .subscribe((data) => {
          this.paymentDetails = data;
          console.log(data);
        });
    });
  };
}
