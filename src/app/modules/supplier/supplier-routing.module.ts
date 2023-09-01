import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SupplierMainComponent } from './pages/supplier-main/supplier-main.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { ReceivedComponent } from './pages/received/received.component';
import { SupplierProfileComponent } from './pages/supplier-profile/supplier-profile.component';
import { OfferComponent } from './pages/offer/offer.component';
import { AcceptedOfferComponent } from './pages/accepted-offer/accepted-offer.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { PaymentComponent } from './pages/payment/payment.component';

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
        path: 'offers/:id',
        component: OfferComponent,
      },
      {
        path: 'accepted-offers',
        component: AcceptedOfferComponent,
      },
      {
        path: 'transaction/:id',
        component: TransactionComponent,
      },
      {
        path: 'transaction/payment/:id',
        component: PaymentComponent,
      },
      {
        path: 'received',
        component: ReceivedComponent,
      },
      {
        path: 'profile',
        component: SupplierProfileComponent,
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
