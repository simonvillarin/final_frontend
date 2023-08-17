import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';
import { AddressService } from 'src/app/shared/services/address-service.service';
import { RegisterService } from 'src/app/shared/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  regions: Observable<any[]> = new Observable<any[]>();
  selectedRegion: any;
  provinces: Observable<any[]> = new Observable<any[]>();
  filteredProvinces: Observable<any[]> = new Observable<any[]>();
  selectedProvince: any;
  cities: Observable<any[]> = new Observable<any[]>();
  filteredCities: Observable<any[]> = new Observable<any[]>();
  selectedCity: any;
  barangays: Observable<any[]> = new Observable<any[]>();
  filteredBarangays: Observable<any[]> = new Observable<any[]>();
  selectedBarangay: any;

  registrationForm!: FormGroup;
  contactInfoFormGroup!: FormGroup;
  activeIndex: number = 0;

  items: any[] = [
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' },
  ];

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      suffix: [''],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.contactInfoFormGroup = this.formBuilder.group({
      street: ['', Validators.required],
      village: ['', Validators.required],
      region: ['', [Validators.required]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      barangay: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.maxLength(11)]],
    });

    this.barangays = this.addressService.getBarangay();
    this.cities = this.addressService.getCities();
    this.provinces = this.addressService.getProvinces();
    this.regions = this.addressService.getRegions();
  }
  ngOnDestroy(): void {}

  constructor(
    private addressService: AddressService,
    private formBuilder: FormBuilder,
    private registerService: RegisterService
  ) {}

  register(): void {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      this.registerService.registerUser(formData).subscribe((response) => {
        this.registrationForm.reset();
        this.activeIndex = 0;
      });
    }
  }

  populateProvince(form: string): void {
    const selectedRegion: any = this.contactInfoFormGroup.get(
      `${form}Region`
    )?.value;
    const selectedRegionCode = selectedRegion ? selectedRegion.id : null;

    if (selectedRegionCode) {
      this.filteredProvinces = this.provinces.pipe(
        map((provinces: any[]) => {
          return provinces.filter(
            (province: any) => province.region_code === selectedRegionCode
          );
        })
      );
    } else {
      this.filteredProvinces = new Observable<any[]>();
    }
  }

  populateCities(form: string): void {
    const selectedRegion: any = this.contactInfoFormGroup?.get(
      `${form}Region`
    )?.value;
    const selectedProvince: any = this.contactInfoFormGroup?.get(
      `${form}Province`
    )?.value;
    const selectedRegionCode = selectedRegion ? selectedRegion.id : null;
    const selectedProvinceCode = selectedProvince ? selectedProvince.id : null;

    if (selectedRegionCode && selectedProvinceCode) {
      this.filteredCities = this.cities.pipe(
        map((cities: any[]) => {
          return cities.filter((city: any) => {
            return (
              city.region_code === selectedRegionCode &&
              city.province_code === selectedProvinceCode
            );
          });
        })
      );
    } else {
      this.filteredCities = new Observable<any[]>();
    }
  }

  populateBarangays(form: string): void {
    const selectedRegion: any = this.contactInfoFormGroup?.get(
      `${form}Region`
    )?.value;
    const selectedProvince: any = this.contactInfoFormGroup?.get(
      `${form}Province`
    )?.value;
    const selectedCity: any = this.contactInfoFormGroup?.get(
      `${form}City`
    )?.value;
    const selectedRegionCode = selectedRegion ? selectedRegion.id : null;
    const selectedProvinceCode = selectedProvince ? selectedProvince.id : null;
    const selectedCityCode = selectedCity ? selectedCity.id : null;

    if (selectedRegionCode && selectedProvinceCode && selectedCityCode) {
      this.filteredBarangays = this.barangays.pipe(
        map((barangays: any[]) => {
          return barangays.filter((barangay: any) => {
            return (
              barangay.region_code === selectedRegionCode &&
              barangay.province_code === selectedProvinceCode &&
              barangay.city_code === selectedCityCode
            );
          });
        })
      );
    } else {
      this.filteredBarangays = new Observable<any[]>();
    }
  }
}
