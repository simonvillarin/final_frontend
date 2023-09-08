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
  offerForm: FormGroup;
  paymentForm: FormGroup;

  tempAds = [];
  ads: any = [];
  ad: any = {};
  paymentAccount: any = {};
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
  checked = false;
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
    this.offerForm = this.fb.group({
      farmerId: [''],
      supplierId: [''],
      postId: [''],
      value: ['', Validators.required],
      price: ['', Validators.required],
    });
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

  get value() {
    return this.offerForm.get('value') as FormControl;
  }

  get price() {
    return this.offerForm.get('price') as FormControl;
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

  onCheckboxChange = (checked: boolean) => {
    if (checked) {
      this.offerForm.patchValue({
        value: this.ad.value,
        price: this.ad.price,
      });
    } else {
      this.offerForm.patchValue({
        value: '',
        price: '',
      });
    }
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
    this.offerService.addOffer(this.offerForm.value).subscribe(() => {
      const payload = {
        isOffered: true,
      };

      this.adService.updateAdvertisement(this.ad.postId, payload).subscribe(
        () => {
          this.getAllAdvertisement();
          this.confirmationDialog = false;
          this.offerDialog = false;

          const value = this.offerForm.get('value')?.value;
          const price = this.offerForm.get('price')?.value;

          const payload = {
            message: `A farmer has an offer on the advertisement that you've posted that you are in need of ${
              this.ad.name
            }. The amount that the farmer offered is P${price} for the ${this.ad.measurement.toLowerCase()} of ${value} ${
              this.ad.measurement === 'Weight' ? 'kg.' : ''
            }`,
          };

          // ONLY USE WHEN DEMO
          // this.smsService.sendSupplierSMS(payload).subscribe(() => {});
        },
        () => {
          this.authService.logout();
        }
      );
    });
  };

  onSubmit = () => {
    if (this.offerForm.valid) {
      this.confirmationDialog = true;
    } else {
      this.offerForm.markAllAsTouched();
    }
  };

  onSubmitPayment = () => {
    if (this.paymentForm.valid) {
      this.paymentAccountService
        .addPaymentAccount(this.paymentForm.value)
        .subscribe(() => {
          this.offerDialog = true;
          this.paymentDialog = false;
          this.getPaymentAccount();

          this.checked = false;
          this.offerForm.reset();
          this.offerForm.patchValue({
            farmerId: this.authService.getUserId(),
            supplierId: this.ad.supplier.userId,
            postId: this.ad.postId,
          });
        });
    } else {
      this.paymentForm.markAllAsTouched();
    }
  };

  onCancelPaymentDialog = () => {
    this.paymentDialog = false;
  };
}
