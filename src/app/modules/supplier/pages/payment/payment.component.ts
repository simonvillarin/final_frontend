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
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { PaymentAccountService } from 'src/app/shared/services/payment-account/payment-account.service';
import { PaymentDetailsService } from 'src/app/shared/services/payment-details/payment-details.service';
import { AcceptedOfferCountService } from 'src/app/shared/services/accepted-offer-count/accepted-offer-count.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;

  user: any = {};
  transactions: any = {};
  payment: any;
  farmer: any = {};
  offers: any = {};
  post: any = {};
  payments: any;
  paymentDetails: any;

  isViewed = false;

  ngOnInit(): void {
    this.getUserById();
    this.getPaymentById();
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
  }

  getUserById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data: any) => {
        this.user = data;
        console.log(data);
      });
  };


  getPaymentById = () => {
    const param = this.route.snapshot.params['id'];

    this.paymentService.getPaymentById(param).subscribe((data: any) => {
      this.payments = data;

      const transactionId = data.transactionId;
      this.paymentService
        .getPaymentByTransactionId(transactionId)
        .subscribe((data) => {
          this.payment = data;
          console.log(data);
        });

      this.paymentDetailsService
        .getPaymentDetailsByTransactionId(transactionId)
        .subscribe((data) => {
          this.paymentDetails = data;
          console.log(data);
        });

      this.transactionService
        .getTransactionById(transactionId)
        .subscribe((data: any) => {
          this.transactions = data;
          console.log(data);

          const offerId = data.offerId;
          this.offerService.getOfferById(offerId).subscribe((data: any) => {
            this.offers = data;
            console.log(data);

            const postId = data.postId;
            this.advertisementService
              .getAdById(postId)
              .subscribe((data: any) => {
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
    });
  };
}
