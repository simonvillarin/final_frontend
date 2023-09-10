import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';
import { FarmerProfileComponent } from './pages/farmer-profile/farmer-profile.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { FarmerMainComponent } from './pages/farmer-main/farmer-main.component';
import { FarmingTipsComponent } from './pages/farming-tips/farming-tips.component';
import { OfferComponent } from './pages/offer/offer.component';
import { AcceptedOfferComponent } from './pages/accepted-offer/accepted-offer.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { HistoryComponent } from './pages/history/history.component';

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
        path: 'advertisements',
        component: AdvertisementComponent,
      },
      {
        path: 'complaints',
        component: ComplaintsComponent,
      },
      {
        path: 'my-offers',
        component: OfferComponent,
      },
      {
        path: 'accepted-offers',
        component: AcceptedOfferComponent,
      },
      {
        path: 'payments',
        component: PaymentsComponent,
      },
      {
        path: 'accepted-offers/transaction-history/:id',
        component: TransactionHistoryComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
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
