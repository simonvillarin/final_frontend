import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { SellProductComponent } from './pages/sell-product/sell-product.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { FarmerMainComponent } from './pages/farmer-main/farmer-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FarmerRoutingModule } from './farmer-routing.module';
import { HistoryComponent } from './pages/history/history.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { FarmerProfileComponent } from './pages/farmer-profile/farmer-profile.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CoursesComponent,
    ComplaintsComponent,
    SellProductComponent,
    PaymentsComponent,
    ScheduleComponent,
    HistoryComponent,
    AdvertisementComponent,
    FarmerProfileComponent,
    FarmerMainComponent,
  ],
  imports: [CommonModule, SharedModule, FarmerRoutingModule],
})
export class FarmerModule {}
