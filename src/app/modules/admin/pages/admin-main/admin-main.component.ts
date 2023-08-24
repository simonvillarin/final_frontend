import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AdminService } from 'src/app/shared/services/admin/admin.service';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss'],
})
export class AdminMainComponent {
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
    private userService: AdminService,
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
    this.getAdminById();
  }

  getAdminById = () => {
    this.userService
      .getUser(this.authService.getUserId())
      .subscribe((data: any) => {
        this.user = data;
        this.username =
        data.firstName + ' ' + data.middleName + ' ' + data.lastName + ' ' + data.suffix;
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
    if (loc == 'dashboard') {
      return 'Dashboard';
    } else if (loc == 'complaints') {
      return 'Complaints';
    } else if (loc == 'farming-tips') {
      return 'Farming Tips';
    } else if (loc == 'farmers') {
      return 'Farmers';
    } else if (loc == 'suppliers') {
      return 'Suppliers';
    } else if (loc == 'profile') {
      return 'Profile';
    } else {
      return this.router.navigate(['/admin/dashboard']);
    }
  };

  profile = () => {
    this.router.navigate(['/admin/profile']);
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
