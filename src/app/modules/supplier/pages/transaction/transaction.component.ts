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
  farmer: any = {};
  offers: any = {};
  transactions: any = {};
  payment: any;
  payments: any;
  alertMessage: string = '';
  post: any = {};

  ngOnInit(): void {
    this.getUserById();
    this.getTransactionById();
  }

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private authService: AuthService,
    private userService: UserService,
    private offerService: OfferService,
    private transactionService: TransactionService,
    private advertisementService: AdvertisementService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      transactionId: [''],
      paymentMode: ['', Validators.required],
    });

    this.transactionForm = this.fb.group({
      paidDate: [''],
      paidTime: [''],
    });
  }

  get paymentMode() {
    return this.paymentForm.get('paymentMode') as FormControl;
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
        this.farmer = data;
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
          this.paymentForm.reset();
          console.log(data);

          this.getPaymentByTransactionId();
        });
    } else {
      this.paymentForm.markAllAsTouched();
    }
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

  onGCashDialog = () => {
    this.gCashDialog = true;
  };

  onPayMayaDialog = () => {
    this.payMayaDialog = true;
  };
}
