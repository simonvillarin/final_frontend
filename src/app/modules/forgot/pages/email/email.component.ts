import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from './../../../../core/auth/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/shared/services/email/email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent {
  emailForm: FormGroup;

  alert = false;
  isSuccess = false;
  isSending = false;

  alertMessage = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private emailService: EmailService
  ) {
    this.emailForm = fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(80)],
      ],
    });
  }

  get email() {
    return this.emailForm.get('email') as FormControl;
  }

  onSubmit = () => {
    if (this.emailForm.valid) {
      this.emailService
        .checkEmail(this.emailForm.value)
        .subscribe((res: any) => {
          if (res.message === 'Email does not exists') {
            this.alert = true;
            this.alertMessage = 'Email does not exists in our system';
            this.isSuccess = false;
            setTimeout(() => (this.alert = false), 3000);
          } else {
            this.isSending = true;

            const min = 100000;
            const max = 999999;
            const code = Math.floor(Math.random() * (max - min + 1)) + min;

            const payload = {
              email: this.emailForm.get('email')?.value,
              subject: `Your One-Time Password (OTP) Code : ${code}`,
              message: `
                  Dear ${res.message},

                  We trust this message finds you in good health. In our ongoing commitment to bolster the security of your account, we have generated a One-Time Password (OTP) code exclusively for you.

                  Your OTP Code: ${code}

                  We kindly request you to use this code within the next 5 minutes to successfully complete resetting your password.

                  We appreciate your continued trust in our services.

                  Warm regards,
                  Hacienda
                `,
            };

            this.emailService.sendEmail(payload).subscribe(() => {
              this.alert = true;
              this.alertMessage = 'OTP code has been sent to your email';
              this.isSuccess = true;
              this.isSending = false;
              setTimeout(() => {
                this.alert = false;
                this.emailForm.reset();
                this.router.navigate(['/forgot/otp']);
              }, 2000);
            });
          }
        });
    } else {
      this.emailForm.markAllAsTouched();
    }
  };
}
