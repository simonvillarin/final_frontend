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

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
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

  ngOnInit(): void {
    this.getUserById();
    this.getPaymentAccountById();
    this.getTransactionById();
    this.getPaymentAccountByFarmerId();
    //this.getAllPayments();
    //this.getAllPaymentAccount();
    //this.getPaymentsByTransactionId();
    // this.getPaymentAccountById();
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
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
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
        paymentMode: this.payment.paymentMode,
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
          this.router.navigate([`/supplier/payment/${id}`]);
        });
    });
  };

  onMethodChange = (paymentMode: string) => {
    if (paymentMode != '') {
      this.error = false;
      this.paymentForm.patchValue({
        paymentMode: paymentMode,
      });
    }
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

          this.payment = '';
          console.log(data);

          this.getTransactionById();
          this.getPaymentByTransactionId();

          this.paymentDetailsService
            .addPaymentDetails(this.paymentForm.value)
            .subscribe((data) => {
              this.paymentDetails = data;
              console.log(data);
            });

          //this.getPaymentDetailsByTransactionId();
          this.paymentForm.reset();
        });
    } else {
      this.paymentForm.markAllAsTouched();
    }

    this.closeOnCardDialog();
  };

  onPlaceOffer = (id: any) => {
    this.router.navigate([`/supplier/transaction/payment/${id}`]);
  };

  cardDialog = false;
  gCashDialog = false;
  payMayaDialog = false;

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

  getPaymentAccountById = () => {
    const param = this.route.snapshot.params['id'];

    this.paymentAccountService
      .getPaymentAccountById(param)
      .subscribe((data: any) => {
        this.paymentAccount = data;
        console.log(data);

        this.paymentForm.patchValue({
          paymentAccountId: this.paymentAccount.paymentAccountId,
        });
      });
  };

  getPaymentDetailsById = () => {
    const param = this.route.snapshot.params['id'];

    this.paymentDetailsService
      .getPaymentDetailsById(param)
      .subscribe((data: any) => {
        this.paymentDetails = data;
        console.log(data);
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

  paidDate: any;
  allPayments: any = {};

  onTransaction = (id: any) => {
    this.router.navigate([`/supplier/payment/${id}`]);
  };

  onPayment = (id: any) => {
    this.router.navigate([`/supplier/transaction/${id}`]);
  };

  getAllPayments = () => {
    this.paymentService.getAllPayments().subscribe((data: any) => {
      this.allPayments = data;
    });
  };

  getPaymentsByTransactionId = () => {
    const param = this.route.snapshot.params['id'];

    this.paymentService.getPaymentByTransactionId(param).subscribe((data) => {
      this.payment = data;
      console.log(data);

      console.log('payment Id:', this.payment.paymentId);
    });
  };

  getPaymentAccountByFarmerId = () => {
    const param = this.route.snapshot.params['id'];

    this.transactionService.getTransactionById(param).subscribe((data: any) => {
      this.transactions = data;
      console.log(data);

      const farmerId = this.transactions.farmerId;
      this.paymentAccountService
        .getPaymentAccountByFarmerId(farmerId)
        .subscribe((data: any) => {
          this.paymentAccount = data;
          console.log('Payment Account By Farmer ID:', data);

          const paymentAccountId = this.paymentAccount.paymentAccountId;
          this.paymentAccountService
            .getPaymentAccountById(paymentAccountId)
            .subscribe((data: any) => {
              this.paymentAccount = data;
              console.log(data);

              this.paymentForm.patchValue({
                paymentAccountId: this.paymentAccount.paymentAccountId,
              });
            });

          this.paymentForm.patchValue({
            paymentAccountId: this.paymentAccount.paymentAccountId,
          });

          console.log(
            'Payment Account By Farmer ID:',
            this.paymentAccount.paymentAccountId
          );
        });
    });
  };

  getAllPaymentAccount = () => {
    this.paymentAccount.getAllPaymentAccount().subscribe((data: any) => {
      this.paymentAccount = data;
      console.log(data);
    });
  };
}
