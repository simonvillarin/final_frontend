import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';
import { AddressService } from 'src/app/shared/services/address/address.service';

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

  regionSelected: any;
  provinceSelected = '';
  citySelected = '';
  barangaySelected = '';

  pass = false;
  confirmPass = false;

  // selectedRegion: any;
  // filteredProvinces: Observable<any[]> = new Observable<any[]>();
  // selectedProvince: any;
  // filteredCities: Observable<any[]> = new Observable<any[]>();
  // selectedCity: any;
  // filteredBarangays: Observable<any[]> = new Observable<any[]>();
  // selectedBarangay: any;

  // registrationForm!: FormGroup;
  // contactInfoFormGroup!: FormGroup;
  // activeIndex: number = 0;

  ngOnInit(): void {
    this.getBarangay();
    this.getCity();
    this.getProvince();
    this.getRegion();
  }

  constructor(private fb: FormBuilder, private addressService: AddressService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      suffix: [''],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      unit: ['', Validators.required],
      street: ['', Validators.required],
      village: ['', Validators.required],
      barangay: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      region: ['', Validators.required],
      zipCode: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
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
      console.log(region);
      console.log(this.tempProvinces);

      this.provinces = this.tempProvinces.filter(
        (province: any) => province.region_code == region.id
      );
    }
  };

  register(): void {
    // if (this.registrationForm.valid) {
    //   const formData = this.registrationForm.value;
    //   this.registerService.registerUser(formData).subscribe((response) => {
    //     this.registrationForm.reset();
    //     this.activeIndex = 0;
    //   });
    // }
  }

  // populateProvince(form: string): void {
  //   const selectedRegion: any = this.contactInfoFormGroup.get(
  //     `${form}Region`
  //   )?.value;
  //   const selectedRegionCode = selectedRegion ? selectedRegion.id : null;

  //   if (selectedRegionCode) {
  //     this.filteredProvinces = this.provinces.pipe(
  //       map((provinces: any[]) => {
  //         return provinces.filter(
  //           (province: any) => province.region_code === selectedRegionCode
  //         );
  //       })
  //     );
  //   } else {
  //     this.filteredProvinces = new Observable<any[]>();
  //   }
  // }

  // populateCities(form: string): void {
  //   const selectedRegion: any = this.contactInfoFormGroup?.get(
  //     `${form}Region`
  //   )?.value;
  //   const selectedProvince: any = this.contactInfoFormGroup?.get(
  //     `${form}Province`
  //   )?.value;
  //   const selectedRegionCode = selectedRegion ? selectedRegion.id : null;
  //   const selectedProvinceCode = selectedProvince ? selectedProvince.id : null;

  //   if (selectedRegionCode && selectedProvinceCode) {
  //     this.filteredCities = this.cities.pipe(
  //       map((cities: any[]) => {
  //         return cities.filter((city: any) => {
  //           return (
  //             city.region_code === selectedRegionCode &&
  //             city.province_code === selectedProvinceCode
  //           );
  //         });
  //       })
  //     );
  //   } else {
  //     this.filteredCities = new Observable<any[]>();
  //   }
  // }

  // populateBarangays(form: string): void {
  //   const selectedRegion: any = this.contactInfoFormGroup?.get(
  //     `${form}Region`
  //   )?.value;
  //   const selectedProvince: any = this.contactInfoFormGroup?.get(
  //     `${form}Province`
  //   )?.value;
  //   const selectedCity: any = this.contactInfoFormGroup?.get(
  //     `${form}City`
  //   )?.value;
  //   const selectedRegionCode = selectedRegion ? selectedRegion.id : null;
  //   const selectedProvinceCode = selectedProvince ? selectedProvince.id : null;
  //   const selectedCityCode = selectedCity ? selectedCity.id : null;

  //   if (selectedRegionCode && selectedProvinceCode && selectedCityCode) {
  //     this.filteredBarangays = this.barangays.pipe(
  //       map((barangays: any[]) => {
  //         return barangays.filter((barangay: any) => {
  //           return (
  //             barangay.region_code === selectedRegionCode &&
  //             barangay.province_code === selectedProvinceCode &&
  //             barangay.city_code === selectedCityCode
  //           );
  //         });
  //       })
  //     );
  //   } else {
  //     this.filteredBarangays = new Observable<any[]>();
  //   }
  // }

  onSubmit = () => {
    if (this.registerForm.valid) {
    } else {
      this.registerForm.markAllAsTouched();
    }
  };
}
