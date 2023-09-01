import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './pages/email/email.component';
import { OtpComponent } from './pages/otp/otp.component';
import { ResetComponent } from './pages/reset/reset.component';
import { ForgotRoutingModule } from './forgot-routing.module';

@NgModule({
  declarations: [EmailComponent, OtpComponent, ResetComponent],
  imports: [CommonModule, ForgotRoutingModule],
})
export class ForgotModule {}
