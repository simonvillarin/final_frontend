import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Location } from '@angular/common';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-supplier-main',
  templateUrl: './supplier-main.component.html',
  styleUrls: ['./supplier-main.component.scss'],
})
export class SupplierMainComponent implements OnInit {
  mobile = false;
  isShowDropdown = false;
  isShowMobileNav = false;

  user: any = {};
  username: string = '';
  userPic: string = '';
  subscription: Subscription | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private userService: UserService,
    private profileService: ProfileService
  ) {
    this.subscription = this.profileService.usernameSubject.subscribe(
      (user) => (this.username = user)
    );
    this.subscription = this.profileService.userPicSubject.subscribe(
      (user) => (this.userPic = user)
    );
  }

  ngOnInit(): void {
    this.getUserById();
  }

  getUserById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data) => {
        this.user = data;
        this.username =
          data.firstName +
          ' ' +
          data.middleName +
          ' ' +
          data.lastName +
          ' ' +
          data.suffix;
        this.userPic = data.image;
      });
  };

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
    const loc1 = splitLocation[splitLocation.length - 2];

    if (loc == 'dashboard') {
      return 'Dashboard';
    } else if (loc == 'advertisement') {
      return 'Advertisement';
    } else if (loc == 'offers' || loc1 == 'offers') {
      return 'Offers';
    } else if (loc == 'accepted-offers') {
      return 'Accepted Offers';
    } else if (loc == 'received') {
      return 'Crop Received';
    } else if (loc == 'transaction' || loc1 == 'transaction') {
      return 'Transaction';
    } else if (loc == 'payment' || loc1 == 'payment') {
      return 'Payment';
    } else if (loc == 'profile') {
      return 'Profile';
    } else {
      return this.router.navigate(['/supplier/dashboard']);
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
    this.router.navigate(['/home']);
    this.isShowDropdown = false;
  };
}
