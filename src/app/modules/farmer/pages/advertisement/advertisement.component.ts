import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
})
export class AdvertisementComponent implements OnInit {
  tempAds = [];
  ads: any = [];
  categories = [
    'Food Crops',
    'Feed Crops',
    'Fiber Crops',
    'Oil Crops',
    'Ornamental Crops',
    'Industrial Crops',
  ];

  gridTwo = false;

  categorySelected: string = '';

  page: number = 0;
  totalAds: number = 0;

  constructor(
    private advertisementService: AdvertisementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAllAdvertisement();
  }

  getAllAdvertisement = () => {
    this.advertisementService.getAllAdvertisement().subscribe(
      (data: any) => {
        this.tempAds = data.sort((a: any, b: any) => b.postId - a.postId);
        this.tempAds = this.tempAds.filter((ad: any) => ad.status === true);
        this.totalAds = this.tempAds.length;
        this.ads = this.tempAds.splice(this.page * 6, 6);
        if (this.ads.length < 3) {
          this.gridTwo = true;
        } else {
          this.gridTwo = false;
        }
      },
      (error) => {
        console.log(error);
        this.authService.logout();
      }
    );
  };

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
      this.advertisementService.getAllAdvertisement().subscribe((data: any) => {
        this.tempAds = data.sort((a: any, b: any) => b.postId - a.postId);
        this.tempAds = this.tempAds.filter((ad: any) => ad.status === true);
        this.totalAds = this.tempAds.length;
        this.ads = this.tempAds.splice(this.page * 6, 6);

        this.ads = this.ads.filter((ad: any) => ad.category == category);
        if (this.ads.length < 3) {
          this.gridTwo = true;
        } else {
          this.gridTwo = false;
        }
      });
    }
  };

  onPageChange = (page: any) => {
    this.page = page.page;
    this.categorySelected = '';
    this.getAllAdvertisement();
  };

  onClear = () => {
    this.categorySelected = '';
    this.getAllAdvertisement();
  };
}
