import { Component } from '@angular/core';

@Component({
  selector: 'app-supplier-profile',
  templateUrl: './supplier-profile.component.html',
  styleUrls: ['./supplier-profile.component.scss'],
})
export class SupplierProfileComponent {
  imagePreview: string | ArrayBuffer | null = null;
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

  regionSelected: any;
  provinceSelected: any;
  citySelected: any;

  currentPass = false;
  pass = false;
  confirmPass = false;

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

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

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
      }
    };

    reader.readAsArrayBuffer(file);
  }

  onRegionChange = (region: any) => {
    if (region != '') {
      this.provinces = this.tempProvinces.filter(
        (province: any) => province.region_code === region.id
      );

      this.barangays = [];
      this.cities = [];
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
}
