import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { PaymentAccountService } from 'src/app/shared/services/payment-account/payment-account.service';
import { SmsService } from 'src/app/shared/services/sms/sms.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
})
export class AdvertisementComponent implements OnInit {
  paymentForm: FormGroup;

  tempAds = [];
  ads: any = [];
  ad: any = {};
  paymentAccount: any = {};
  payload: any = {};
  categories = [
    'Food Crops',
    'Feed Crops',
    'Fiber Crops',
    'Oil Crops',
    'Ornamental Crops',
    'Industrial Crops',
  ];

  offerDialog = false;
  confirmationDialog = false;
  paymentDialog = false;
  alert = false;
  hasPaymentAcc = false;

  alertMessage = '';
  categorySelected = '';
  btnLabel = '';

  page: number = 0;
  totalAds: number = 0;

  empty = true;
  search = '';

  constructor(
    private advertisementService: AdvertisementService,
    private authService: AuthService,
    private offerService: OfferService,
    private adService: AdvertisementService,
    private fb: FormBuilder,
    private paymentAccountService: PaymentAccountService,
    private smsService: SmsService
  ) {
    this.paymentForm = this.fb.group({
      farmerId: ['', Validators.required],
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
  }

  ngOnInit(): void {
    this.getAllAdvertisement();
    this.getPaymentAccount();
  }

  getAllAdvertisement = () => {
    this.advertisementService
      .getAllAdvertisement(this.authService.getUserId())
      .subscribe(
        (data: any) => {
          this.tempAds = data.sort((a: any, b: any) => b.postId - a.postId);
          this.tempAds = this.tempAds.filter((ad: any) => ad.status === true);
          this.totalAds = this.tempAds.length;
          this.ads = this.tempAds.splice(this.page * 5, 5);
        },
        () => {
          this.authService.logout();
        }
      );
  };

  getPaymentAccount = () => {
    this.paymentAccountService
      .getPaymentAccountByFarmerId(this.authService.getUserId())
      .subscribe((data) => {
        if (data) {
          this.hasPaymentAcc = true;
          this.paymentAccount = data;
        } else {
          this.hasPaymentAcc = false;
        }
      });
  };

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
      this.advertisementService
        .getAllAdvertisement(this.authService.getUserId())
        .subscribe(
          (data: any) => {
            this.tempAds = data.sort((a: any, b: any) => b.postId - a.postId);
            this.tempAds = this.tempAds.filter((ad: any) => ad.status === true);
            this.totalAds = this.tempAds.length;
            this.ads = this.tempAds.splice(this.page * 5, 5);

            this.ads = this.ads.filter((ad: any) => ad.category == category);
          },
          () => {
            this.authService.logout();
          }
        );
    }
  };

  onPageChange = (page: any) => {
    this.page = page.page;
    this.categorySelected = '';
    this.getAllAdvertisement();
  };

  onSearchChange = (search: string) => {
    if (search !== '') {
      this.ads = this.ads.filter(
        (ad: any) =>
          ad.name.toLowerCase().includes(search.toLowerCase()) ||
          ad.description.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      this.getAllAdvertisement();
    }
  };

  onClear = () => {
    this.categorySelected = '';
    this.getAllAdvertisement();
  };

  onOffer = (ad: any) => {
    if (!ad.isOffered) {
      this.paymentForm.reset();
      this.paymentForm.patchValue({
        farmerId: this.authService.getUserId(),
      });

      if (this.hasPaymentAcc) {
        this.paymentForm.patchValue({
          accountNumber: this.paymentAccount.accountNumber,
          accountName: this.paymentAccount.accountName,
        });
      }
      this.paymentDialog = true;

      this.ad = ad;
    }
  };

  onCancelOfferDialog = () => {
    this.offerDialog = false;
  };

  onCancelConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onConfirm = () => {
    this.offerService.addOffer(this.payload).subscribe(() => {
      const payload = {
        isOffered: true,
      };

      this.adService.updateAdvertisement(this.ad.postId, payload).subscribe(
        () => {
          this.getAllAdvertisement();
          this.confirmationDialog = false;
          this.offerDialog = false;

          const payload1 = {
            message: `A farmer has an offer on the advertisement that you've posted that you are in need of ${
              this.ad.name
            }. The amount that the farmer offered is ₱ ${
              this.ad.price
            } for the ${
              this.ad.measurement === 'Quantity' ? 'quantity' : 'weight'
            } of ${this.ad.value} ${
              this.ad.measurement === 'Weight' ? 'kg.' : ''
            }`,
          };

          // ONLY USE WHEN DEMO
          // this.smsService.sendSupplierSMS(payload1).subscribe(() => {});
        },
        () => {
          this.authService.logout();
        }
      );
    });
  };

  onSubmitPayment = () => {
    if (this.paymentForm.valid) {
      this.paymentAccountService
        .addPaymentAccount(this.paymentForm.value)
        .subscribe(() => {
          this.paymentDialog = false;
          this.getPaymentAccount();

          this.payload.farmerId = this.authService.getUserId();
          this.payload.supplierId = this.ad.supplier.userId;
          this.payload.postId = this.ad.postId;
          this.payload.value = this.ad.value;
          this.payload.price = this.ad.price;
          this.confirmationDialog = true;
        });
    } else {
      this.paymentForm.markAllAsTouched();
    }
  };

  onCancelPaymentDialog = () => {
    this.paymentDialog = false;
  };
}
