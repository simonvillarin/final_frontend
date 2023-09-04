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

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  user: any = {};
  transactions: any = {};
  payment: any;
  farmer: any = {};
  offers: any = {};
  post: any = {};
  allPayments: any = {};
  payments: any;

  ngOnInit(): void {
    this.getUserById();
    this.getAllPayments();
    //this.getTransactionById();
    //this.getPaymentByTransactionId();
    this.getPaymentById();
  }

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private paymentService: PaymentService,
    private userService: UserService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private offerService: OfferService,
    private advertisementService: AdvertisementService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getUserById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data: any) => {
        this.user = data;
        console.log(data);
      });
  };

  getAllPayments = () => {
    this.paymentService.getAllPayments().subscribe((data: any) => {
      this.allPayments = data;
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
