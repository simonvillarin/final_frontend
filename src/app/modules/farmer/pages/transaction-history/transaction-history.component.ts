import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { PaymentDetailsService } from 'src/app/shared/services/payment-details/payment-details.service';
import { deliveryDateValidator } from 'src/app/shared/validators/custom.validator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
  providers: [
    DatePipe
  ],
})
export class TransactionHistoryComponent implements OnInit {
  paymentForm: FormGroup;
  transactionsForm: FormGroup;

  user: any = {};
  transactions: any = {};
  payment: any;
  offers: any = {};
  post: any = {};
  paymentDetails: any;
  suppliers: any;
  paymentAccount: any;
  transanction: any;

  ngOnInit(): void {
    this.getUserById();
    this.getTransactionById();
    this.getPaymentByTransactionId();
    this.getPaymentDetailsByTransactionId();
  }

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private userService: UserService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private offerService: OfferService,
    private advertisementService: AdvertisementService,
    private paymentDetailsService: PaymentDetailsService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      transactionId: [''],
      paymentAccountId: [''],
      paymentMode: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
    });

    this.transactionsForm = this.fb.group({
      deliverDate: ['', [Validators.required, deliveryDateValidator()]],
    });
  }

  get deliverDate() {
    return this.transactionsForm.get('deliverDate') as FormControl;
  }

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

  addDeliveryDialog = false;
  confirmDeliveryDialog = false;

  onAddDeliveryDate = () => {
    this.addDeliveryDialog = true;
  };

  onCancelDeliveryDialog = () => {
    this.addDeliveryDialog = false;
  };

  onConfirmDeliveryDialog = () => {
    console.log(this.transactionsForm.value);
    console.log(this.transactions.transactionId);
    this.addDeliveryDialog = false;
    this.confirmDeliveryDialog = true;
  };

  onCancelConfrimDeliveryDialog = () => {
    this.confirmDeliveryDialog = false;
  };

  error = false;

  onSubmit = () => {
    console.log(this.transactionsForm.value);
    if (this.transanction === '') {
      this.error = true;
      scroll(1000, 1000);
    }

    if (this.transactionsForm.valid) {
      this.transactionService
        .updateTransaction(
          this.transactions.transactionId,
          this.transactionsForm.value
        )
        .subscribe((data) => {
          scroll(1000, 1000);
          console.log(data);

          this.getTransactionById();
        });
    } else {
      this.transactionsForm.markAllAsTouched();
    }
    this.onCancelConfrimDeliveryDialog();
  };
}
