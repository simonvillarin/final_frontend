import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/shared/services/admin/admin.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { TransactionService } from 'src/app/shared/services/transaction/transaction.service';
import { AcceptedOfferCountService } from 'src/app/shared/services/accepted-offer-count/accepted-offer-count.service';

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

  acceptedOffers: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private userService: UserService,
    private profileService: ProfileService,
    private transactionService: TransactionService,
    private acceptedOfferCountService: AcceptedOfferCountService
  ) {
    this.subscription = this.profileService.usernameSubject.subscribe(
      (user) => (this.username = user)
    );
    this.subscription = this.profileService.userPicSubject.subscribe(
      (user) => (this.userPic = user)
    );
    this.subscription =
      this.acceptedOfferCountService.acceptedOfferCount.subscribe(
        (acceptedOffer) => (this.acceptedOffers = acceptedOffer)
      );
  }

  ngOnInit(): void {
    this.getUserById();
    this.getAcceptedOffers();
  }

  getUserById = () => {
    this.userService.getUserById(this.authService.getUserId()).subscribe(
      (data) => {
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
      },
      () => {
        this.authService.logout();
      }
    );
  };

  getAcceptedOffers = () => {
    this.transactionService
      .getTransactionByFarmerId(this.authService.getUserId())
      .subscribe((data: any) => {
        data.forEach((acceptedOffer: any) => {
          if (!acceptedOffer.isViewed) {
            this.acceptedOffers += 1;
          }
        });
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
    const loc2 = splitLocation[splitLocation.length - 3];

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
    } else if (loc1 == 'transaction-history' || loc2 == 'accepted-offers') {
      return 'Transaction History';
    } else if (loc == 'transactions') {
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
