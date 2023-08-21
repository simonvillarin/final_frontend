import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-supplier-main',
  templateUrl: './supplier-main.component.html',
  styleUrls: ['./supplier-main.component.scss'],
})
export class SupplierMainComponent {
  mobile = false;
  isShowDropdown = false;
  isShowMobileNav = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  toggleMobile = () => {
    this.mobile = !this.mobile;
  };

  toggleShowDropdown = () => {
    this.isShowDropdown = !this.isShowDropdown;
    this.isShowMobileNav = false;
  };

  openMobileNav = () => {
    this.isShowMobileNav = true;
    scroll(0, 0);
  };

  closeMobileNav = () => {
    this.isShowMobileNav = false;
  };

  getLocation = () => {
    const currentLocation = this.location.path();
    const splitLocation = currentLocation.split('/');
    const loc = splitLocation[splitLocation.length - 1];
    if (loc == 'dashboard') {
      return 'Dashboard';
    } else if (loc == 'advertisement') {
      return 'Advertisement';
    } else if (loc == 'payments') {
      return 'Crop Payment';
    } else if (loc == 'received') {
      return 'Crop Received';
    } else {
      return 'Profile';
    }
  };

  profile = () => {
    this.router.navigate(['/supplier/profile']);
    this.isShowDropdown = false;
  };

  logout = () => {
    if (this.authService.isUserLoggedIn()) {
      localStorage.removeItem('user');
    }
    this.router.navigate(['/']);
    this.isShowDropdown = false;
  };
}
