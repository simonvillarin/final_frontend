import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  payments: any = [];
  payment: any = {};

  image: any;
  name: any;
  category: any;
  description: any;
  measurement: any;
  value: any;
  price: any;
  paymentIdRef: any;
  paymentDate: any;
  deliverDate: any;
  deliveredTo: any;
  contact: any;
  address: any;

  sales: any;
  soldCrops: any;

  usedColors: any = [];
  borders: any = [];
  colors: any = [];
  salesLabels: any = [];
  soldLabels: any = [];
  salesData: any = [];
  soldData: any = [];

  empty = true;
  detailsDialog = false;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.paymentService
      .getPaymentByFarmerId(this.authService.getUserId())
      .subscribe(
        (res: any) => {
          this.payments = res.sort(
            (a: any, b: any) => b.paymentId - a.paymentId
          );
          this.payments.forEach((payment: any) => {
            if (this.salesLabels.length > 0) {
              this.salesLabels.forEach((label: any) => {
                if (
                  label !== payment.payment.transaction.offer.advertisement.name
                ) {
                  this.salesLabels.push(
                    payment.payment.transaction.offer.advertisement.name
                  );
                  const measurement =
                    payment.payment.transaction.offer.advertisement
                      .measurement === 'Quantity'
                      ? 'Quantity'
                      : 'Kilos';
                  const val =
                    payment.payment.transaction.offer.advertisement.name +
                    ' (' +
                    measurement +
                    ')';
                  this.soldLabels.push(val);
                  this.salesData.push(payment.payment.transaction.offer.price);
                  this.soldData.push(payment.payment.transaction.offer.value);
                  this.generateRandomColor();
                } else {
                  const pay = this.salesData.find(
                    (pay: any) =>
                      pay.payment.transaction.offer.advertisement.name ===
                      payment.payment.transaction.offer.advertisement.name
                  );
                  const index = this.salesData.indexOf(pay);
                  this.salesData[index] =
                    this.salesData[index] +
                    payment.payment.transaction.offer.price;
                  this.soldData[index] =
                    this.soldData[index] +
                    payment.payment.transaction.offer.value;
                }
              });
            } else {
              this.salesLabels.push(
                payment.payment.transaction.offer.advertisement.name
              );
              const measurement =
                payment.payment.transaction.offer.advertisement.measurement ===
                'Quantity'
                  ? 'Quantity'
                  : 'Kilos';
              const val =
                payment.payment.transaction.offer.advertisement.name +
                ' (' +
                measurement +
                ')';
              this.soldLabels.push(val);
              this.salesData.push(payment.payment.transaction.offer.price);
              this.soldData.push(payment.payment.transaction.offer.value);
              this.generateRandomColor();
            }
          });

          this.sales = {
            labels: this.salesLabels,
            datasets: [
              {
                label: 'Sales',
                data: this.salesData,
                backgroundColor: this.colors,
                borderColor: this.borders,
                borderWidth: 1,
              },
            ],
          };

          this.soldCrops = {
            labels: this.soldLabels,
            datasets: [
              {
                label: 'Sold Crops',
                data: this.soldData,
                backgroundColor: this.colors,
                borderColor: this.borders,
                borderWidth: 1,
              },
            ],
          };
        },
        () => {
          this.authService.logout();
        }
      );

    this.payments;
  }

  onView = (payment: any) => {
    this.payment = payment;
    console.log(this.payment);
    this.image = this.payment.payment.transaction.offer.advertisement.image;
    this.name = this.payment.payment.transaction.offer.advertisement.name;
    this.category =
      this.payment.payment.transaction.offer.advertisement.category;
    this.description =
      this.payment.payment.transaction.offer.advertisement.description;
    this.measurement =
      this.payment.payment.transaction.offer.advertisement.measurement;
    this.value = this.payment.payment.transaction.offer.value;
    this.price = this.payment.payment.transaction.offer.price;
    this.paymentIdRef = this.payment.payment.paymentIdRef;
    this.paymentDate = this.payment.payment.transaction.paidDate;
    this.deliverDate = this.payment.payment.transaction.deliverDate;
    this.deliveredTo =
      this.payment.fullName ||
      this.payment.payment.transaction.supplier.firstName;
    this.contact = this.payment.contact;
    this.address =
      this.payment.unit +
      ', ' +
      this.payment.street +
      ', ' +
      this.payment.village +
      ', ' +
      this.payment.barangay +
      ', ' +
      this.payment.city +
      ', ' +
      this.payment.province +
      ', ' +
      this.payment.region;

    this.detailsDialog = true;
  };

  onCloseDetailsDialog = () => {
    this.detailsDialog = false;
  };

  convertTime = (time: any) => {
    if (time) {
      const splitTime = time.split(':');
      let hour;
      let zone;
      if (parseInt(splitTime[0]) == 13) {
        hour = 1;
      } else if (parseInt(splitTime[0]) == 13) {
        hour = 1;
      } else if (parseInt(splitTime[0]) == 14) {
        hour = 2;
      } else if (parseInt(splitTime[0]) == 15) {
        hour = 3;
      } else if (parseInt(splitTime[0]) == 16) {
        hour = 4;
      } else if (parseInt(splitTime[0]) == 17) {
        hour = 5;
      } else if (parseInt(splitTime[0]) == 18) {
        hour = 6;
      } else if (parseInt(splitTime[0]) == 19) {
        hour = 7;
      } else if (parseInt(splitTime[0]) == 20) {
        hour = 8;
      } else if (parseInt(splitTime[0]) == 21) {
        hour = 9;
      } else if (parseInt(splitTime[0]) == 22) {
        hour = 10;
      } else if (parseInt(splitTime[0]) == 23) {
        hour = 11;
      } else if (parseInt(splitTime[0]) == 24 || splitTime[0] == '00') {
        hour = 12;
      } else {
        hour = splitTime[0];
      }

      if (parseInt(splitTime[0]) > 12) {
        zone = 'PM';
      } else {
        zone = 'AM';
      }

      return hour + ':' + splitTime[1] + ' ' + zone;
    } else {
      return null;
    }
  };

  generateRandomColor() {
    let randomColor: string;
    do {
      randomColor = this.getRandomColor();
    } while (this.usedColors.includes(randomColor));

    this.usedColors.push(randomColor);
    this.colors.push(`rgba(${randomColor}, 0.2)`);
    this.borders.push(`rgb(${randomColor})`);
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;

    return `${r},${g},${b}`;
  }
}
