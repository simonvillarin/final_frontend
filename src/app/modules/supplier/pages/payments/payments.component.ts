import { Component } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent {
  categories = [
    'Food Crops',
    'Feed Crops',
    'Fiber Crops',
    'Oil Crops',
    'Ornamental Crops',
    'Industrial Crops',
  ];
  categorySelected: string = '';

  onCategoryChange = (category: string) => {
    if (this.categorySelected !== '') {
    }
  };

  onClear = () => {
    this.categorySelected = '';
  };
}
