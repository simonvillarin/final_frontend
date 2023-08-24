import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AddressService } from 'src/app/shared/services/address/address.service';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { UserService } from 'src/app/shared/services/user/user.service';
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

@Component({
  selector: 'app-farmer-profile',
  templateUrl: './farmer-profile.component.html',
  styleUrls: ['./farmer-profile.component.scss'],
})
export class FarmerProfileComponent implements OnInit {
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
  barangaySelected: any;

  alert = false;
  isError = false;
  currentPass = false;
  pass = false;
  confirmPass = false;
  confirmationDialog = false;
  personal = false;
  hasReloaded = false;

  alertMessage = '';

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private userService: UserService,
    private authService: AuthService,
    private profileService: ProfileService
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
    this.getUserById();
  }

  getUserById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data: any) => {
        this.user = data;
        this.profileService.setUserPic(data.image);
        this.profileService.setUsername(
          data.firstName + ' ' + data.middleName + ' ' + data.lastName
        );

        const split = data.birthdate.split('-');
        this.personalForm.patchValue({
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          suffix: data.suffix,
          gender: data.gender,
          birthdate: split[1] + '/' + split[2] + '/' + split[0],
          contact: data.contact,
          email: data.email,
        });

        this.addressForm.patchValue({
          unit: data.unit,
          street: data.street,
          village: data.village,
          zipCode: data.zipCode,
        });

        this.addressService.getRegion().subscribe((data: any) => {
          data.map((region: any) => {
            this.regions.push(region);
          });
          let indexOfRegion: number = 0;
          this.regions.forEach((region: any, i: number) => {
            if (region.name === this.user.region) {
              indexOfRegion = i;
            }
          });
          this.regionSelected = this.regions[indexOfRegion];

          this.addressService.getProvince().subscribe((data: any) => {
            data.map((arr: any) => {
              this.tempProvinces.push(arr);
            });

            this.provinces = this.tempProvinces.filter(
              (province: any) => province.region_code === this.regionSelected.id
            );
            let index: number = 0;
            this.provinces.forEach((province: any, i: number) => {
              if (province.name === this.user.province) {
                index = i;
              }
            });
            this.provinceSelected = this.provinces[index];

            this.addressService.getCity().subscribe((data: any) => {
              data.map((arr: any) => {
                this.tempCities.push(arr);
              });

              this.cities = this.tempCities.filter(
                (city: any) => city.province_code == this.provinceSelected.id
              );

              let index: number = 0;
              this.cities.forEach((city: any, i: number) => {
                if (city.name == this.user.city) {
                  index = i;
                }
              });
              this.citySelected = this.cities[index];

              this.addressService.getBarangay().subscribe((data: any) => {
                data.map((arr: any) => {
                  this.tempBarangays.push(arr);
                });

                this.barangays = this.tempBarangays.filter(
                  (barangay: any) => barangay.city_code == this.citySelected.id
                );

                let index: number = 0;
                this.barangays.forEach((barangay: any, i: number) => {
                  if (barangay.name === this.user.barangay) {
                    index = i;
                  }
                });
                this.barangaySelected = this.barangays[index];
              });
            });
          });
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
      this.barangays = [];
      this.cities = [];
      this.cities = this.tempCities.filter(
        (city: any) => city.province_code == province.id
      );
    }
  };

  onCityChange = (city: any) => {
    if (city != '') {
      this.barangays = [];
      this.barangays = this.tempBarangays.filter(
        (barangay: any) => barangay.city_code == city.id
      );
    }
  };

  onSubmitPersonal = () => {
    this.personal = true;
    this.confirmationDialog = true;
  };

  onSubmitAddress = () => {
    this.personal = false;
    this.confirmationDialog = true;
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

  onCancelSave = () => {
    this.confirmationDialog = false;
  };

  onSave = () => {
    if (this.personal) {
      if (this.personalForm.valid) {
        let payload: any = {};
        if (this.user.firstName !== this.personalForm.get('firstName')?.value) {
          payload.firstName = this.personalForm.get('firstName')?.value;
        }
        if (
          this.user.middleName !== this.personalForm.get('middleName')?.value
        ) {
          payload.middleName = this.personalForm.get('middleName')?.value;
        }
        if (this.user.lastName !== this.personalForm.get('lastName')?.value) {
          payload.lastName = this.personalForm.get('lastName')?.value;
        }
        if (this.user.suffix !== this.personalForm.get('suffix')?.value) {
          payload.suffix = this.personalForm.get('suffix')?.value;
        }
        if (this.user.gender !== this.personalForm.get('gender')?.value) {
          payload.gender = this.personalForm.get('gender')?.value;
        }
        const splitDate = this.personalForm.get('birthdate')?.value.split('/');
        if (
          this.user.birthdate !==
          splitDate[2] + '-' + splitDate[0] + '-' + splitDate[1]
        ) {
          payload.birthdate = this.personalForm.get('birthdate')?.value;
        }
        if (this.user.contact !== this.personalForm.get('contact')?.value) {
          payload.contact = this.personalForm.get('contact')?.value;
        }
        if (this.user.email !== this.personalForm.get('email')?.value) {
          payload.email = this.personalForm.get('email')?.value;
        }

        this.userService
          .updateUser(this.authService.getUserId(), payload)
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
              this.confirmationDialog = false;
            }
          });
      } else {
        this.personalForm.markAllAsTouched();
      }
    } else {
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
            this.confirmationDialog = false;
          });
      } else {
        this.addressForm.markAllAsTouched();
      }
    }
  };
}
