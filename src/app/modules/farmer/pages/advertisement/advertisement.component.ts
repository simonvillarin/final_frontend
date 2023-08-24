import { Component, OnInit } from '@angular/core';
import { AdvertisementService } from 'src/app/shared/services/advertisement/advertisement.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
})
export class AdvertisementComponent implements OnInit {
  ads: any = [];
  gridLayout = true;

  constructor(private advertisementService: AdvertisementService) {}

  ngOnInit(): void {
    this.getAllAdvertisement();
  }

  getAllAdvertisement = () => {
    this.advertisementService.getAllAdvertisement().subscribe((data: any) => {
      this.ads = data;
      console.log(data);
    });
  };
}
