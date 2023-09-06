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
import { SmsService } from 'src/app/shared/services/sms/sms.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
})
export class AdvertisementComponent implements OnInit {
  offerForm: FormGroup;

  tempAds = [];
  ads: any = [];
  ad: any = {};
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
  alert = false;
  checked = false;

  alertMessage = '';
  categorySelected = '';

  page: number = 0;
  totalAds: number = 0;

  constructor(
    private advertisementService: AdvertisementService,
    private authService: AuthService,
    private offerService: OfferService,
    private adService: AdvertisementService,
    private fb: FormBuilder,
    private smsService: SmsService
  ) {
    this.offerForm = this.fb.group({
      farmerId: [''],
      supplierId: [''],
      postId: [''],
      value: ['', Validators.required],
      price: ['', Validators.required],
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

  onClear = () => {
    this.categorySelected = '';
    this.getAllAdvertisement();
  };

  onOffer = (ad: any) => {
    if (!ad.isOffered) {
      this.ad = ad;
      this.offerForm.reset();

      this.offerForm.patchValue({
        farmerId: this.authService.getUserId(),
        supplierId: ad.supplier.userId,
        postId: ad.postId,
      });
      this.offerDialog = true;
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
}
