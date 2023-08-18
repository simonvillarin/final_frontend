import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CoursesComponent } from './components/courses/courses.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { AdvertisementsComponent } from './components/advertisements/advertisements.component';
import { SellProductComponent } from './components/sell-product/sell-product.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    CoursesComponent,
    ComplaintsComponent,
    AdvertisementsComponent,
    SellProductComponent,
    PaymentsComponent,
    ProfileComponent,
    ScheduleComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FarmerModule { }
