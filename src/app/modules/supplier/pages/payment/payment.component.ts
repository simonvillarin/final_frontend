import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AddressService } from 'src/app/shared/services/address/address.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;

  barangays: any = [];
  cities: any = [];
  provinces: any = [];
  regions: any = [];

  tempBarangays: any = [];
  tempCities: any = [];
  tempProvinces: any = [];
  tempRegions: any = [];

  regionSelected: any;
  provinceSelected: any;
  citySelected: any;

  error = false;
  pass = false;
  confirmPass = false;

  alert = false;
  isError = false;

  payment: string = '';
  alertMessage: string = '';

  ngOnInit(): void {

  }

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private paymentService: PaymentService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
    });
  }

  get paymentMethod() {
    return this.paymentForm.get('paymentMethod') as FormControl;
  }

  onMethodChange = (paymentMethod: string) => {
    if (paymentMethod != '') {
      this.error = false;
      this.paymentForm.patchValue({
        paymentMethod: paymentMethod,
      });
    }
  };

  onSubmit = () => {
    console.log(this.paymentForm.value);
    if (this.payment === '') {
      this.error = true;
      scroll(0, 0);
    }

    if (this.paymentForm.valid) {
      this.paymentForm.patchValue({
        region: this.paymentForm.get('region')?.value.name,
        province: this.paymentForm.get('province')?.value.name,
        city: this.paymentForm.get('city')?.value.name,
        barangay: this.paymentForm.get('barangay')?.value.name,
      });

      this.paymentService
        .addPayment(this.paymentForm.value)
        .subscribe((data) => {

            scroll(0, 0);

            const radioButtons =
              this.elementRef.nativeElement.querySelectorAll('.radio');
            radioButtons.forEach((radio: any) => {
              this.renderer.setProperty(radio, 'checked', false);
            });
            this.payment = '';
            this.paymentForm.reset();
            console.log(data);
          });
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

  onPaymentOffer = () => {
    this.router.navigate([`/supplier/transaction/payment`]);
  };
}
