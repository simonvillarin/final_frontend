import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { EmailService } from 'src/app/shared/services/email/email.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import {
  PasswordLengthValidator,
  hasUppercaseValidator,
  hasLowercaseValidator,
  hasNumberValidator,
  hasSymbolValidator,
  confirmPasswordValidator,
} from 'src/app/shared/validators/custom.validator';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {
  resetForm: FormGroup;

  alert = false;
  confirmPass = false;
  pass = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private emailService: EmailService
  ) {
    this.resetForm = fb.group({
      password: [
        '',
        [
          Validators.required,
          PasswordLengthValidator(),
          hasUppercaseValidator(),
          hasLowercaseValidator(),
          hasNumberValidator(),
          hasSymbolValidator(),
        ],
      ],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator()]],
    });
  }

  get password() {
    return this.resetForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword') as FormControl;
  }

  togglePassword = () => {
    this.pass = !this.pass;
  };

  toggleConfirmPassword = () => {
    this.confirmPass = !this.confirmPass;
  };

  onSubmit = () => {
    if (this.resetForm.valid) {
      this.emailService.getUserId().subscribe((data) => {
        this.emailService
          .updateUser(data, this.resetForm.value)
          .subscribe(() => {
            this.alert = true;
            this.resetForm.reset();
            setTimeout(() => {
              this.alert = false;
              this.router.navigate(['/login']);
            }, 2000);
          });
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  };
}
