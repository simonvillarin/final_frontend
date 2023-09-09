import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { SellProductComponent } from './pages/sell-product/sell-product.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { FarmerProfileComponent } from './pages/farmer-profile/farmer-profile.component';
import { FarmerMainComponent } from './pages/farmer-main/farmer-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FarmerRoutingModule } from './farmer-routing.module';
import { CardModule } from 'primeng/card';
import { MatIconModule } from '@angular/material/icon';
import { FarmingTipsComponent } from './pages/farming-tips/farming-tips.component';
import { AccordionModule } from 'primeng/accordion';
import { OfferComponent } from './pages/offer/offer.component';
import { AcceptedOfferComponent } from './pages/accepted-offer/accepted-offer.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { DateAddPipe } from './pages/transaction-history/pipe/date-add.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    CoursesComponent,
    ComplaintsComponent,
    SellProductComponent,
    PaymentsComponent,
    ScheduleComponent,
    TransactionHistoryComponent,
    AdvertisementComponent,
    FarmerProfileComponent,
    FarmerMainComponent,
    FarmingTipsComponent,
    OfferComponent,
    AcceptedOfferComponent,
    TransactionsComponent,
    DateAddPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    FarmerRoutingModule,
    CardModule,
    MatIconModule,
    AccordionModule,
    YouTubePlayerModule,
  ]
})
export class FarmerModule {}
