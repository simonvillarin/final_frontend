import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierMainComponent } from './pages/supplier-main/supplier-main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SupplierRoutingModule } from './supplier-routing.module';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { ReceivedComponent } from './pages/received/received.component';
import { SupplierProfileComponent } from './pages/supplier-profile/supplier-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { AcceptedOfferComponent } from './pages/accepted-offer/accepted-offer.component';
import { OfferComponent } from './pages/offer/offer.component';
import { TransactionComponent } from './pages/transaction/transaction.component';

@NgModule({
  declarations: [
    SupplierMainComponent,
    DashboardComponent,
    AdvertisementComponent,
    ReceivedComponent,
    SupplierProfileComponent,
    AcceptedOfferComponent,
    OfferComponent,
    TransactionComponent,
  ],
  imports: [CommonModule, SharedModule, SupplierRoutingModule, MatIconModule],
})
export class SupplierModule {}
