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
import { UserService } from 'src/app/shared/services/user/user.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { OfferService } from 'src/app/shared/services/offer/offer.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  paymentForm: FormGroup;

  error = false;
  pass = false;
  confirmPass = false;

  alert = false;
  isError = false;
  sidebarVisible: boolean = false;

  user: any = {};
  offers: any = {};
  posts: any = {};
  payment: string = '';
  alertMessage: string = '';

  ngOnInit(): void {
    this.getUserById();
    //this.getOfferById();
    this.getOfferByPostId();
  }

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private userService: UserService,
    private offerService: OfferService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
    });
  }

  get paymentMethod() {
    return this.paymentForm.get('paymentMethod') as FormControl;
  }

  getUserById = () => {
    this.userService
      .getUserById(this.authService.getUserId())
      .subscribe((data: any) => {
        this.user = data;
        console.log(data);
      });
  };

  getOfferById = () => {
    const param = this.route.snapshot.params['id'];

    this.offerService.getOfferById(param).subscribe((data: any) => {
      this.offers = data;
      console.log(data);
    });
  };

  getOfferByPostId = () => {
    const param = this.route.snapshot.params['id'];

    this.offerService.getOfferByPostId(param).subscribe((data: any) => {
      this.posts = data;
      console.log(data);
    });
  };

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
      scroll(1000, 1000);
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
          scroll(1000, 1000);

          const radioButtons =
            this.elementRef.nativeElement.querySelectorAll('.radio');
          radioButtons.forEach((radio: any) => {
            this.renderer.setProperty(radio, 'checked', false);
          });
          this.payment = '';
          this.paymentForm.reset();
          console.log(data);
          this.router.navigate([`/supplier/transaction/payment`]);
        });
    } else {
      this.paymentForm.markAllAsTouched();
    }
  };
}
