import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { SellProductComponent } from './pages/sell-product/sell-product.component';
import { HistoryComponent } from './pages/history/history.component';
import { FarmerProfileComponent } from './pages/farmer-profile/farmer-profile.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { FarmerMainComponent } from './pages/farmer-main/farmer-main.component';
import { FarmingTipsComponent } from './pages/farming-tips/farming-tips.component';

const routes: Routes = [
  {
    path: '',
    component: FarmerMainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'farming-tips',
        component: FarmingTipsComponent,
      },
      {
        path: 'courses',
        component: CoursesComponent,
      },
      {
        path: 'advertisement',
        component: AdvertisementComponent,
      },
      {
        path: 'complaints',
        component: ComplaintsComponent,
      },
      {
        path: 'sell-product',
        component: SellProductComponent,
      },
      {
        path: 'payments',
        component: PaymentsComponent,
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
      },
      {
        path: 'history',
        component: HistoryComponent,
      },
      {
        path: 'profile',
        component: FarmerProfileComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmerRoutingModule {}
