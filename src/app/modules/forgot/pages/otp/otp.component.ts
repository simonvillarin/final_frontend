import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { EmailService } from 'src/app/shared/services/email/email.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {
  otpForm: FormGroup;

  alert = false;

  alertMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private emailService: EmailService
  ) {
    this.otpForm = fb.group({
      otp: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  get otp() {
    return this.otpForm.get('otp') as FormControl;
  }

  onSubmit = () => {
    if (this.otpForm.valid) {
      this.emailService.isOTP(this.otpForm.value).subscribe((res: any) => {
        if (!res) {
          this.alert = true;
          this.alertMessage = 'Invalid OTP code';
          setTimeout(() => (this.alert = false), 3000);
        } else {
          this.emailService.isOTPExpired().subscribe((data: any) => {
            if (data) {
              this.alert = true;
              this.alertMessage = 'OTP code is expired';
              setTimeout(() => (this.alert = false), 3000);
            } else {
              this.router.navigate(['/forgot/reset']);
            }
          });
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
    }
  };
}
