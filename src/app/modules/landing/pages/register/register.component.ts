import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AddressService } from 'src/app/shared/services/address/address.service';
import { RegisterService } from 'src/app/shared/services/register/register.service';
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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  genders = ['Male', 'Female', 'Others'];
  barangays: any = [];
  cities: any = [];
  provinces: any = [];
  regions: any = [];

  tempBarangays: any = [];
  tempCities: any = [];
  tempProvinces: any = [];
  tempRegions: any = [];

  type: string = '';
  regionSelected: any;
  provinceSelected: any;
  citySelected: any;

  error = false;
  pass = false;
  confirmPass = false;

  ngOnInit(): void {
    this.getBarangay();
    this.getCity();
    this.getProvince();
    this.getRegion();
  }

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private registerService: RegisterService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      suffix: [''],
      gender: ['', Validators.required],
      birthdate: ['', [Validators.required, birthdateValidator()]],
      unit: ['', Validators.required],
      street: ['', Validators.required],
      village: ['', Validators.required],
      barangay: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      region: ['', Validators.required],
      zipCode: ['', [Validators.required, zipcodeValidator()]],
      contact: ['', [Validators.required, mobileNumberValidator()]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
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
      role: [''],
    });
  }

  get firstName() {
    return this.registerForm.get('firstName') as FormControl;
  }

  get middleName() {
    return this.registerForm.get('middleName') as FormControl;
  }

  get lastName() {
    return this.registerForm.get('lastName') as FormControl;
  }

  get suffix() {
    return this.registerForm.get('suffix') as FormControl;
  }

  get gender() {
    return this.registerForm.get('gender') as FormControl;
  }

  get birthdate() {
    return this.registerForm.get('birthdate') as FormControl;
  }

  get unit() {
    return this.registerForm.get('unit') as FormControl;
  }

  get street() {
    return this.registerForm.get('street') as FormControl;
  }

  get village() {
    return this.registerForm.get('village') as FormControl;
  }

  get barangay() {
    return this.registerForm.get('barangay') as FormControl;
  }

  get city() {
    return this.registerForm.get('city') as FormControl;
  }

  get province() {
    return this.registerForm.get('province') as FormControl;
  }

  get region() {
    return this.registerForm.get('region') as FormControl;
  }

  get zipCode() {
    return this.registerForm.get('zipCode') as FormControl;
  }

  get contact() {
    return this.registerForm.get('contact') as FormControl;
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }

  get username() {
    return this.registerForm.get('username') as FormControl;
  }

  get password() {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get role() {
    return this.registerForm.get('role') as FormControl;
  }

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

  togglePassword = () => {
    this.pass = !this.pass;
  };

  toggleConfirmPassword = () => {
    this.confirmPass = !this.confirmPass;
  };

  onRegionChange = (region: any) => {
    if (region != '') {
      this.provinces = this.tempProvinces.filter(
        (province: any) => province.region_code === region.id
      );

      this.barangays = [];
      this.cities = [];
      // this.registerForm.patchValue({
      //   region: region.name,
      // });
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

  onRoleChange = (role: string) => {
    if (role != '') {
      this.error = false;
      this.registerForm.patchValue({
        role: role,
      });
    }
  };

  onSubmit = () => {
    if (this.registerForm.valid) {
      if (this.type != '') {
        this.registerForm.patchValue({
          region: this.registerForm.get('region')?.value.name,
          province: this.registerForm.get('province')?.value.name,
          city: this.registerForm.get('city')?.value.name,
          barangay: this.registerForm.get('barangay')?.value.name,
        });

        this.registerService
          .registerUser(this.registerForm.value)
          .subscribe((response) => {
            console.log('Registration successful:', response);
            this.registerForm.reset();
          });

        this.registerForm.reset();
      } else {
        this.error = true;
        scroll(0, 0);
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  };
}
