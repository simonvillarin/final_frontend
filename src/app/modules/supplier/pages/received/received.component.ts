import { Component } from '@angular/core';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.scss'],
})
export class ReceivedComponent {
  categories = [
    'Food Crops',
    'Feed Crops',
    'Fiber Crops',
    'Oil Crops',
    'Ornamental Crops',
    'Industrial Crops',
  ];
  categorySelected: string = '';
  ads: any = [];

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
    }
  };

  onClear = () => {
    this.categorySelected = '';
  };
}
