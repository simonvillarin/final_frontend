import { Component } from '@angular/core';
import {
  PasswordLengthValidator,
  hasUppercaseValidator,
  hasLowercaseValidator,
  hasNumberValidator,
  hasSymbolValidator,
  zipcodeValidator,
  mobileNumberValidator,
  birthdateValidator,
  confirmPasswordValidator,
} from 'src/app/shared/validators/custom.validator';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AddressService } from 'src/app/shared/services/address/address.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
})
export class AdminProfileComponent {
  personalForm: FormGroup;
  addressForm: FormGroup;
  passwordForm: FormGroup;

  file: any;
  genders = ['Male', 'Female', 'Others'];
  barangays: any = [];
  cities: any = [];
  provinces: any = [];
  regions: any = [];

  tempBarangays: any = [];
  tempCities: any = [];
  tempProvinces: any = [];
  tempRegions: any = [];

  user: any = {};

  regionSelected: any;
  provinceSelected: any;
  citySelected: any;

  alert = false;
  isError = false;
  currentPass = false;
  pass = false;
  confirmPass = false;

  alertMessage = '';

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.personalForm = fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      suffix: [''],
      gender: ['', Validators.required],
      birthdate: ['', [Validators.required, birthdateValidator()]],
      contact: ['', [Validators.required, mobileNumberValidator()]],
      email: ['', [Validators.required, Validators.email]],
    });
    this.addressForm = fb.group({
      unit: ['', Validators.required],
      street: ['', Validators.required],
      village: ['', Validators.required],
      barangay: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      region: ['', Validators.required],
      zipCode: ['', [Validators.required, zipcodeValidator()]],
    });
    this.passwordForm = fb.group({
      password: [
        '',
        [
          Validators.required,
          PasswordLengthValidator(),
          hasUppercaseValidator(),
          hasLowercaseValidator(),
          hasNumberValidator(),
          hasSymbolValidator(),
        ],
      ],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator()]],
    });
  }

  get firstName() {
    return this.personalForm.get('firstName') as FormControl;
  }

  get middleName() {
    return this.personalForm.get('middleName') as FormControl;
  }

  get lastName() {
    return this.personalForm.get('lastName') as FormControl;
  }

  get suffix() {
    return this.personalForm.get('suffix') as FormControl;
  }

  get gender() {
    return this.personalForm.get('gender') as FormControl;
  }

  get birthdate() {
    return this.personalForm.get('birthdate') as FormControl;
  }

  get unit() {
    return this.addressForm.get('unit') as FormControl;
  }

  get street() {
    return this.addressForm.get('street') as FormControl;
  }

  get village() {
    return this.addressForm.get('village') as FormControl;
  }

  get barangay() {
    return this.addressForm.get('barangay') as FormControl;
  }

  get city() {
    return this.addressForm.get('city') as FormControl;
  }

  get province() {
    return this.addressForm.get('province') as FormControl;
  }

  get region() {
    return this.addressForm.get('region') as FormControl;
  }

  get zipCode() {
    return this.addressForm.get('zipCode') as FormControl;
  }

  get contact() {
    return this.personalForm.get('contact') as FormControl;
  }

  get email() {
    return this.personalForm.get('email') as FormControl;
  }

  get password() {
    return this.passwordForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword') as FormControl;
  }

  ngOnInit(): void {
    this.getRegion();
    this.getBarangay();
    this.getCity();
    this.getProvince();
    this.getUserById();
  }

  getUserById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data: any) => {
        this.user = data;
      });
  };

  getBarangay = () => {
    this.addressService.getBarangay().subscribe((data: any) => {
      data.map((arr: any) => {
        this.tempBarangays.push(arr);
      });
    });
  };

  getCity = () => {
    this.addressService.getCity().subscribe((data: any) => {
      data.map((arr: any) => {
        this.tempCities.push(arr);
      });
    });
  };

  getProvince = () => {
    this.addressService.getProvince().subscribe((data: any) => {
      data.map((arr: any) => {
        this.tempProvinces.push(arr);
      });
    });
  };

  getRegion = () => {
    this.addressService.getRegion().subscribe((data: any) => {
      data.map((region: any) => {
        this.regions.push(region);
      });
    });
  };

  toggleCurrentPassword = () => {
    this.currentPass = !this.currentPass;
  };

  togglePassword = () => {
    this.pass = !this.pass;
  };

  toggleConfirmPassword = () => {
    this.confirmPass = !this.confirmPass;
  };

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {};

    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      this.readFileAsBytes(file);
    }

    reader.readAsDataURL(this.file);
  }

  readFileAsBytes(file: File) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        const mimeType = file.type;
        const fileName = file.name;

        const payload = {
          filename: fileName,
          mimeType: mimeType,
          data: Array.from(bytes),
        };

        this.userService
          .updateUser(this.authService.getUserId(), payload)
          .subscribe(() => {
            this.getUserById();
          });
      }
    };

    reader.readAsArrayBuffer(file);
  }

  onRegionChange = (region: any) => {
    if (region != '') {
      this.barangays = [];
      this.cities = [];
      this.provinces = [];
      this.provinces = this.tempProvinces.filter(
        (province: any) => province.region_code === region.id
      );
    }
  };

  onProvinceChange = (province: any) => {
    if (province != '') {
      this.cities = this.tempCities.filter(
        (city: any) => city.province_code == province.id
      );
    }
  };

  onCityChange = (city: any) => {
    if (city != '') {
      this.barangays = this.tempBarangays.filter(
        (barangay: any) => barangay.city_code == city.id
      );
    }
  };

  onSubmitPersonal = () => {
    if (this.personalForm.valid) {
      this.userService
        .updateUser(this.authService.getUserId(), this.personalForm.value)
        .subscribe((res: any) => {
          if (res.message == 'Contact number already exists') {
            this.alert = true;
            this.isError = true;
            this.alertMessage = 'Contact no already exists';
            setTimeout(() => (this.alert = false), 3000);
          } else if (res.message == 'Email already exists') {
            this.alert = true;
            this.isError = true;
            this.alertMessage = 'Email address already exists';
            setTimeout(() => (this.alert = false), 3000);
          } else {
            this.getUserById();
            this.personalForm.reset();
            this.alert = true;
            this.alertMessage = 'Personal information successfully updated';
            setTimeout(() => (this.alert = false), 3000);
          }
        });
    } else {
      this.personalForm.markAllAsTouched();
    }
  };

  onSubmitAddress = () => {
    if (this.addressForm.valid) {
      this.addressForm.patchValue({
        region: this.addressForm.get('region')?.value.name,
        province: this.addressForm.get('province')?.value.name,
        city: this.addressForm.get('city')?.value.name,
        barangay: this.addressForm.get('barangay')?.value.name,
      });

      this.userService
        .updateUser(this.authService.getUserId(), this.addressForm.value)
        .subscribe(() => {
          this.getUserById();
          this.addressForm.reset();
          this.alert = true;
          this.alertMessage = 'Address information successfully updated';
          setTimeout(() => (this.alert = false), 3000);
        });
    } else {
      this.addressForm.markAllAsTouched();
    }
  };

  onSubmitPassword = () => {
    if (this.passwordForm.valid) {
      this.userService
        .updateUser(this.authService.getUserId(), this.passwordForm.value)
        .subscribe(() => {
          this.getUserById();
          this.passwordForm.reset();
          this.alert = true;
          this.alertMessage = 'Login information successfully updated';
          setTimeout(() => (this.alert = false), 3000);
        });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  };
}
