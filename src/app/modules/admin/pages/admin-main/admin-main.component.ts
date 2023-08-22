import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AdminService } from 'src/app/shared/services/admin/admin.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss'],
})
export class AdminMainComponent {
  mobile = false;
  isShowDropdown = false;
  isShowMobileNav = false;

  admin: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private userService: AdminService
  ) {}

  ngOnInit(): void {
    this.getAdminById();
  }

  getAdminById = () => {
    this.userService
      .getUser(this.authService.getUserId())
      .subscribe((data: any) => {
        this.admin = data;
        console.log(data);
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
    } else {
      return 'Profile';
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
