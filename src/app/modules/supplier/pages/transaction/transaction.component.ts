import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AddressService } from 'src/app/shared/services/address/address.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';
import { PaymentDetailsService } from 'src/app/shared/services/payment-details/payment-details.service';
import { PaymentAccountService } from 'src/app/shared/services/payment-account/payment-account.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  providers: [
    DatePipe
  ],
})
export class TransactionComponent implements OnInit {
  paymentForm: FormGroup;
  transactionForm: FormGroup;

  error = false;

  alert = false;
  isError = false;

  user: any = {};
  farmers: any = {};
  farmer: any;
  offers: any = {};
  transactions: any = {};
  payment: any;
  payments: any;
  alertMessage: string = '';
  post: any = {};
  paymentDetails: any;
  paymentAccount: any;
  paidDate: any;
  allPayments: any = {};

  ngOnInit(): void {
    this.getUserById();
    this.getTransactionById();
    this.getPaymentAccountByFarmerId();
    this.getPaymentDetailsByTransactionId();
  }

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private authService: AuthService,
    private userService: UserService,
    private offerService: OfferService,
    private transactionService: TransactionService,
    private advertisementService: AdvertisementService,
    private paymentDetailsService: PaymentDetailsService,
    private paymentAccountService: PaymentAccountService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      transactionId: [''],
      paymentAccountId: [''],
      paymentMode: ['', Validators.required],
      accountNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(17),
        ],
      ],
      accountName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
    });

    this.transactionForm = this.fb.group({
      paidDate: [''],
      paidTime: [''],
    });
  }

  get paymentMode() {
    return this.paymentForm.get('paymentMode') as FormControl;
  }

  get accountNumber() {
    return this.paymentForm.get('accountNumber') as FormControl;
  }

  get accountName() {
    return this.paymentForm.get('accountName') as FormControl;
  }

  get expirationDate() {
    return this.paymentForm.get('expirationDate') as FormControl;
  }

  get securityCode() {
    return this.paymentForm.get('securityCode') as FormControl;
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

      const farmerId = data.farmerId;
      this.userService.getUserById(farmerId).subscribe((data: any) => {
        this.farmers = data;
        console.log(data);
      });
    });
  };

  getPaymentByTransactionId = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;
      console.log(data);

      this.paymentForm.patchValue({
        transactionId: this.transactions.transactionId,
        paymentAccountId: this.paymentAccount.paymentAccountId,
      });

      const transactionId = data.transactionId;
      this.paymentService
        .getPaymentByTransactionId(transactionId)
        .subscribe((data) => {
          this.payment = data;
          console.log(data);

          this.transactionForm.patchValue({
            paidDate: this.payment.paymentDate,
            paidTime: this.payment.paymentTime,
          });

          const payload = {
            paidDate: this.payment.paymentDate,
            paidTime: this.payment.paymentTime,
            isViewed: true,
          };

          this.transactionService
            .updateTransaction(this.transactions.transactionId, payload)
            .subscribe((data) => {
              console.log(data);
            });

          const id = data.paymentId;
          scroll(0, 0);
          this.router.navigate([`/supplier/payment/${id}`]);
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

          this.getPaymentByTransactionId(); 
        });
    });
  };

  getPaymentAccountByFarmerId = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;

      const farmerId = this.transactions.farmerId;
      this.paymentAccountService
        .getPaymentAccountByFarmerId(farmerId)
        .subscribe((data: any) => {
          this.paymentAccount = data;
          console.log('Payment Account By Farmer ID:', data);

          this.paymentForm.patchValue({
            paymentAccountId: this.paymentAccount.paymentAccountId,
          });
        });
    });
  };

  onSubmit = () => {
    console.log(this.paymentForm.value);
    if (this.payment === '') {
      this.error = true;
      scroll(1000, 1000);
    }

    if (this.paymentForm.valid) {
      this.paymentService
        .addPayment(this.paymentForm.value)
        .subscribe((data) => {
          scroll(1000, 1000);

          const radioButtons =
            this.elementRef.nativeElement.querySelectorAll('.radio');
          radioButtons.forEach((radio: any) => {
            this.renderer.setProperty(radio, 'checked', false);
          });

          console.log(data);

          this.paymentDetailsService
            .addPaymentDetails(this.paymentForm.value)
            .subscribe((data) => {
              scroll(1000, 1000);
              console.log(data);
            });

          this.getPaymentByTransactionId();
          this.getPaymentDetailsByTransactionId();
        });
    } else {
      this.paymentForm.markAllAsTouched();
    }
    this.closeOnPlaceOfferDialog();
  };

  onMethodChange = (paymentMode: string) => {
    if (paymentMode != '') {
      this.error = false;
      scroll(2000, 2000);
      this.paymentForm.patchValue({
        paymentMode: paymentMode,
      });
    }
  };

  cardDialog = false;
  gCashDialog = false;
  payMayaDialog = false;
  placeOfferDialog = false;

  /**onTransaction = () => {
    if (this.isViewed = true) {
      this.getPaymentByTransactionId();
    } else {
      this.authService.logout();
    }
  }; **/

  onCardDialog = () => {
    this.cardDialog = true;
  };

  closeOnCardDialog = () => {
    this.cardDialog = false;
  };

  onGCashDialog = () => {
    this.gCashDialog = true;
  };

  onPayMayaDialog = () => {
    this.payMayaDialog = true;
  };

  onPlaceOfferDialog = () => {
    console.log(this.paymentForm.value);
    this.placeOfferDialog = true;
  };

  closeOnPlaceOfferDialog = () => {
    this.placeOfferDialog = false;
  };
}
