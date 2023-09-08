import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/shared/services/admin/admin.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';

@Component({
  selector: 'app-farmer-main',
  templateUrl: './farmer-main.component.html',
  styleUrls: ['./farmer-main.component.scss'],
})
export class FarmerMainComponent {
  mobile = false;
  isShowDropdown = false;
  isShowMobileNav = false;

  farmer: any;
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
        this.username = data.firstName;
        if (data.middleName) {
          this.username += ' ' + data.middleName;
        }
        if (data.lastName) {
          this.username += ' ' + data.lastName;
        }
        if (data.suffix) {
          this.username += ' ' + data.suffix;
        }

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
    } else if (loc == 'farming-tips') {
      return 'Farming Tips';
    } else if (loc == 'courses') {
      return 'Courses';
    } else if (loc == 'advertisements') {
      return 'Advertisements';
    } else if (loc == 'complaints') {
      return 'Complaints';
    } else if (loc == 'my-offers') {
      return 'My Offers';
    } else if (loc == 'accepted-offers') {
      return 'Accepted Offers';
    } else if (loc == 'payments') {
      return 'Payments';
    } else if (loc == 'history') {
      return 'History';
    } else if (loc == 'history') {
      return 'History';
    } else if (loc == 'profile') {
      return 'Profile';
    } else {
      return this.router.navigate(['/farmer/dashboard']);
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
    this.router.navigate(['/home']);
    this.isShowDropdown = false;
  };
}
