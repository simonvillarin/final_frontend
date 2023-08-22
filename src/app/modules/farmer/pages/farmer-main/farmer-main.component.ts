import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-farmer-main',
  templateUrl: './farmer-main.component.html',
  styleUrls: ['./farmer-main.component.scss']
})
export class FarmerMainComponent {
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
    } else if (loc == 'courses') {
      return 'Courses';
    } else if (loc == 'advertisement') {
      return 'Posts';
    } else if (loc == 'complaints') {
      return 'Complaints';
    } else if (loc == 'sell-product') {
      return 'Sell Product';
    } else if (loc == 'payments') {
      return 'Payments';
    } else if (loc == 'history') {
      return 'History';
    } else {
      return 'Profile';
    }
  };

  profile = () => {
    this.router.navigate(['/farmer/profile']);
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