import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
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
  ads: any = [];
  img: any = {};
  postId: any;
  categorySelected: string = '';

  addDialog = false;
  confirmationDialog = false;
  showImage = false;
  isEditing = false;
  emptyImage = false;

  constructor(
    private advertisementService: AdvertisementService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.adForm = fb.group({
      supplierId: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      mass: ['', Validators.required],
      price: ['', Validators.required],
      filename: ['', Validators.required],
      mimeType: ['', Validators.required],
      data: ['', Validators.required],
    });
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

  get quantity() {
    return this.adForm.get('quantity') as FormControl;
  }

  get mass() {
    return this.adForm.get('mass') as FormControl;
  }

  get price() {
    return this.adForm.get('price') as FormControl;
  }

  ngOnInit(): void {
    this.getAdBySupplierId();
  }

  getAdBySupplierId = () => {
    this.advertisementService
      .getAdBySupplierId(this.authService.getUserId())
      .subscribe((data: any) => {
        this.ads = data.sort((a: any, b: any) => b.postId - a.postId);
      });
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
          this.ads = data.sort((a: any, b: any) => b.postId - a.postId);
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
    this.showImage = true;
    this.adForm.patchValue({
      name: ad.name,
      category: ad.category,
      description: ad.description,
      quantity: ad.quantity,
      mass: ad.mass,
      price: ad.price,
    });
    this.postId = ad.postId;
    this.addDialog = true;
  };

  onSubmit = () => {
    if (this.isEditing) {
      let payload: any = {};
      if (this.adForm.get('name')?.value != '') {
        payload.name = this.adForm.get('name')?.value;
      }
      if (this.adForm.get('category')?.value != '') {
        payload.category = this.adForm.get('category')?.value;
      }
      if (this.adForm.get('description')?.value != '') {
        payload.description = this.adForm.get('description')?.value;
      }
      if (this.adForm.get('quantity')?.value != '') {
        payload.quantity = this.adForm.get('quantity')?.value;
      }
      if (this.adForm.get('mass')?.value != '') {
        payload.mass = this.adForm.get('mass')?.value;
      }
      if (this.adForm.get('price')?.value != '') {
        payload.price = this.adForm.get('price')?.value;
      }
      if (this.adForm.get('filename')?.value != '') {
        payload.filename = this.adForm.get('filename')?.value;
        payload.mimeType = this.adForm.get('mimeType')?.value;
        payload.data = this.adForm.get('data')?.value;
      }

      this.advertisementService
        .updateAdvertisement(this.postId, payload)
        .subscribe(() => {
          this.getAdBySupplierId();
          this.adForm.reset();
          this.addDialog = false;
        });
    } else {
      if (this.adForm.get('fileName')?.value === '') {
        alert('Please upload a crop image');
      }

      if (this.adForm.valid) {
        this.advertisementService
          .addAdvertisement(this.adForm.value)
          .subscribe(() => {
            this.getAdBySupplierId();
            this.adForm.reset();
            this.addDialog = false;
          });
      } else {
        this.adForm.markAllAsTouched();
        this.emptyImage = true;
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
}
