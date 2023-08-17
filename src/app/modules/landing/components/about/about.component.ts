import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  image: string = '../../../../../assets/images/gallery1.jpg';
  gallery1 = true;
  gallery2 = false;
  gallery3 = false;
  gallery4 = false;
  gallery5 = false;

  onGallery1 = (img: string) => {
    this.gallery1 = true;
    this.gallery2 = false;
    this.gallery3 = false;
    this.gallery4 = false;
    this.gallery5 = false;
    this.image = img;
  };

  onGallery2 = (img: string) => {
    this.gallery1 = false;
    this.gallery2 = true;
    this.gallery3 = false;
    this.gallery4 = false;
    this.gallery5 = false;
    this.image = img;
  };

  onGallery3 = (img: string) => {
    this.gallery1 = false;
    this.gallery2 = false;
    this.gallery3 = true;
    this.gallery4 = false;
    this.gallery5 = false;
    this.image = img;
  };

  onGallery4 = (img: string) => {
    this.gallery1 = false;
    this.gallery2 = false;
    this.gallery3 = false;
    this.gallery4 = true;
    this.gallery5 = false;
    this.image = img;
  };

  onGallery5 = (img: string) => {
    this.gallery1 = false;
    this.gallery2 = false;
    this.gallery3 = false;
    this.gallery4 = false;
    this.gallery5 = true;
    this.image = img;
  };
}
