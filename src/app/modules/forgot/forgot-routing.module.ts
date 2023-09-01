import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OtpComponent } from './pages/otp/otp.component';
import { EmailComponent } from './pages/email/email.component';
import { ResetComponent } from './pages/reset/reset.component';

const routes: Routes = [
  { path: 'email', component: EmailComponent },
  { path: 'otp', component: OtpComponent },
  {
    path: 'reset',
    component: ResetComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class ForgotRoutingModule {}
