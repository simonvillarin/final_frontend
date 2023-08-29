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
    private fb: FormBuilder
  ) {
    this.offerForm = this.fb.group({
      farmerId: [''],
      supplierId: [''],
      postId: [''],
      quantity: ['', Validators.required],
      mass: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  get quantity() {
    return this.offerForm.get('quantity') as FormControl;
  }

  get mass() {
    return this.offerForm.get('mass') as FormControl;
  }

  get price() {
    return this.offerForm.get('price') as FormControl;
  }

  ngOnInit(): void {
    this.getAllAdvertisement();
  }

  getAllAdvertisement = () => {
    this.advertisementService.getAllAdvertisement().subscribe(
      (data: any) => {
        this.tempAds = data.sort((a: any, b: any) => b.postId - a.postId);
        this.tempAds = this.tempAds.filter(
          (ad: any) => ad.status === true && ad.isOffered === false
        );
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
      this.advertisementService.getAllAdvertisement().subscribe(
        (data: any) => {
          this.tempAds = data.sort((a: any, b: any) => b.postId - a.postId);
          this.tempAds = this.tempAds.filter(
            (ad: any) => ad.status === true && ad.transaction === false
          );
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
        quantity: this.ad.quantity,
        mass: this.ad.mass,
        price: this.ad.price,
      });
    } else {
      this.offerForm.patchValue({
        quantity: '',
        mass: '',
        price: '',
      });
    }
  };

  onClear = () => {
    this.categorySelected = '';
    this.getAllAdvertisement();
  };

  onOffer = (ad: any) => {
    this.ad = ad;
    this.offerForm.reset();

    this.offerForm.patchValue({
      farmerId: this.authService.getUserId(),
      supplierId: ad.supplier.userId,
      postId: ad.postId,
    });
    this.offerDialog = true;
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
