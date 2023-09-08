import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { SmsService } from 'src/app/shared/services/sms/sms.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';
import { OfferCountService } from 'src/app/shared/services/offer-count/offer-count.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
  providers: [MessageService],
})
export class AdvertisementComponent implements OnInit {
  adForm: FormGroup;

  imagePreview: string | ArrayBuffer | null = null;
  file: any;
  categories = [
    'Food Crops',
    'Feed Crops',
    'Fiber Crops',
    'Oil Crops',
    'Ornamental Crops',
    'Industrial Crops',
  ];
  measurementTypes = ['Quantity', 'Weight'];
  ads: any = [];
  tempAds: any = [];
  img: any = {};
  supplier: any = {};
  postId: any;

  search = '';
  alertMessage = '';
  categorySelected: string = '';
  measurementSelected: string = '';

  addDialog = false;
  confirmationDialog = false;
  showImage = false;
  isEditing = false;
  emptyImage = false;
  gridTwo = false;
  alert = false;

  empty = true;

  page: number = 0;
  totalAds: number = 0;
  offers: number = 0;
  subscription: Subscription | undefined;

  constructor(
    private advertisementService: AdvertisementService,
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private smsService: SmsService,
    private offerService: OfferService,
    private userService: UserService,
    private offerCountService: OfferCountService
  ) {
    this.adForm = fb.group({
      supplierId: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      measurement: ['', Validators.required],
      value: ['', Validators.required],
      price: ['', Validators.required],
      filename: [''],
      mimeType: [''],
      data: [''],
    });

    this.subscription = this.offerCountService.offerCount.subscribe(
      (offerCount) => {
        this.offers = offerCount;
      }
    );
  }

  get name() {
    return this.adForm.get('name') as FormControl;
  }

  get category() {
    return this.adForm.get('category') as FormControl;
  }

  get description() {
    return this.adForm.get('description') as FormControl;
  }

  get measurement() {
    return this.adForm.get('measurement') as FormControl;
  }

  get value() {
    return this.adForm.get('value') as FormControl;
  }

  get price() {
    return this.adForm.get('price') as FormControl;
  }

  ngOnInit(): void {
    this.getAdBySupplierId();
    this.getSupplierById();
    this.getBadge();
  }

  getSupplierById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data) => {
        this.supplier = data;
      });
  };

  getAdBySupplierId = () => {
    this.advertisementService
      .getAdBySupplierId(this.authService.getUserId())
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

  getBadge = () => {
    this.offerService
      .getOfferBySupplierId(this.authService.getUserId())
      .subscribe((data: any) => {
        data.forEach((offer: any) => {
          if (!offer.isViewed) {
            this.offers += 1;
          }
        });
      });
  };

  onMeasurementChange = (measurement: string) => {
    if (measurement !== '') {
      this.measurementSelected = measurement;
    }
  };

  onFileSelected(event: any) {
    this.emptyImage = false;
    this.file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      this.readFileAsBytes(file);
    }

    reader.readAsDataURL(this.file);
    this.showImage = true;
  }

  readFileAsBytes(file: File) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        const mimeType = file.type;
        const fileName = file.name;

        this.adForm.patchValue({
          supplierId: this.authService.getUserId(),
          filename: fileName,
          mimeType: mimeType,
          data: Array.from(bytes),
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
      this.advertisementService
        .getAdBySupplierId(this.authService.getUserId())
        .subscribe((data: any) => {
          this.tempAds = data.sort((a: any, b: any) => b.postId - a.postId);
          this.tempAds = this.tempAds.filter((ad: any) => ad.status === true);
          this.totalAds = this.tempAds.length;
          this.ads = this.tempAds.splice(this.page * 6, 6);

          this.ads = this.ads.filter((ad: any) => ad.category == category);
        });
    }
  };

  onClear = () => {
    this.categorySelected = '';
    this.getAdBySupplierId();
  };

  openAddDialog = () => {
    this.isEditing = false;
    this.adForm.reset();
    this.emptyImage = false;
    this.showImage = false;
    this.addDialog = true;
  };

  closeAddDialog = () => {
    this.addDialog = false;
  };

  onEdit = (ad: any) => {
    this.isEditing = true;
    this.emptyImage = false;
    this.imagePreview = ad.image;

    if (this.imagePreview !== null) {
      this.showImage = true;
    } else {
      this.showImage = false;
    }

    this.adForm.patchValue({
      name: ad.name,
      category: ad.category,
      description: ad.description,
      measurement: ad.measurement,
      value: ad.value,
      price: ad.price,
    });
    this.postId = ad.postId;
    this.addDialog = true;
  };

  onSubmit = () => {
    this.adForm.patchValue({
      supplierId: this.authService.getUserId(),
    });

    if (this.isEditing) {
      if (this.adForm.valid) {
        this.advertisementService
          .updateAdvertisement(this.postId, this.adForm.value)
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail: 'Updated Successfully',
            });
            this.getAdBySupplierId();
            this.adForm.reset();
            this.addDialog = false;
          });
      } else {
        this.adForm.markAllAsTouched();
      }
    } else {
      if (this.adForm.valid) {
        this.advertisementService
          .addAdvertisement(this.adForm.value)
          .subscribe((res: any) => {
            if (res.message === 'Crop name already exists') {
              this.alert = true;
              this.alertMessage = 'Crop name already exists';
              setTimeout(() => (this.alert = false), 3000);
            } else {
              const name = this.adForm.get('name')?.value;
              const measurement = this.adForm.get('measurement')?.value;
              const value = this.adForm.get('value')?.value;

              this.messageService.add({
                severity: 'success',
                summary: 'Added',
                detail: 'Added Successfully',
              });
              this.getAdBySupplierId();
              this.adForm.reset();
              this.addDialog = false;

              const payload = {
                message: `Supplier: ${this.supplier.firstName} ${
                  this.supplier.lastName
                } has posted an advertisement that ${
                  this.supplier.gender === 'Male' ? 'he' : 'she'
                } is in need of a ${name} with a ${measurement.toLowercase()} of ${value} ${
                  measurement === 'Weight' ? 'kg.' : ''
                }`,
              };
              // ONLY USE WHEN DEMO
              // this.smsService.sendFarmerSMS(payload).subscribe(() => {});
            }
          });
      } else {
        this.adForm.markAllAsTouched();
      }
    }
  };

  onCloseConfirmationDialog = () => {
    this.confirmationDialog = false;
  };

  onRemove = (ad: any) => {
    this.postId = ad.postId;
    this.confirmationDialog = true;
  };

  onDelete = () => {
    this.advertisementService
      .updateAdvertisement(this.postId, {
        status: false,
      })
      .subscribe(() => {
        this.getAdBySupplierId();
        this.confirmationDialog = false;
      });
  };

  onPageChange = (page: any) => {
    this.page = page.page;
    this.categorySelected = '';
    this.getAdBySupplierId();
  };

  onViewOffers = (id: any) => {
    this.router.navigate([`/supplier/offers/${id}`]);
  };

  onSearchChange = (search: string) => {
    if (search !== '') {
      this.ads = this.ads.filter(
        (ad: any) =>
          ad.name.toLowerCase().includes(search.toLowerCase()) ||
          ad.description.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      this.getAdBySupplierId();
    }
  };
}
