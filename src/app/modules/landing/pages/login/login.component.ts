import { AuthService } from './../../../../core/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { tap } from 'rxjs';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  showPassword: boolean = false;
  pass = false;
  confirmPass = false;
  isError = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService
  ) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get username() {
    return this.loginForm.get('username') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  togglePassword = () => {
    this.pass = !this.pass;
  };

  forgot = () => {
    this.router.navigate(['/forgot/email']);
  };

  onSubmit = () => {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(
        (res: any) => {
          const user = {
            token: res.token,
            id: res.id,
            role: res.role,
          };
          localStorage.setItem('user', JSON.stringify(user));

          if (res.role == 'Supplier') {
            this.router.navigate(['/supplier/dashboard']);
          } else if (res.role == 'Admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (res.role == 'Farmer') {
            this.router.navigate(['/farmer/dashboard']);
          }

          this.loginForm.reset();
        },
        (error) => {
          if (error.status === 500) {
            this.isError = true;
            setTimeout(() => (this.isError = false), 3000);
          } else {
            this.authService.logout();
          }
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  };
}
