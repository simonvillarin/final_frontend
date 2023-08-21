import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SupplierMainComponent } from './pages/supplier-main/supplier-main.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ReceivedComponent } from './pages/received/received.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierMainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'advertisement',
        component: AdvertisementComponent,
      },
      {
        path: 'payments',
        component: PaymentsComponent,
      },
      {
        path: 'received',
        component: ReceivedComponent,
      },
      {
        path: 'profile',
        component: AdminProfileComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierRoutingModule {}
