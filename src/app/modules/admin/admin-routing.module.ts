import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './pages/admin-main/admin-main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { FarmingTipsComponent } from './pages/farming-tips/farming-tips.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { FarmersComponent } from './pages/farmers/farmers.component';
import { CoursesComponent } from './pages/courses/courses.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'complaints',
        component: ComplaintsComponent,
      },
      {
        path: 'farming-tips',
        component: FarmingTipsComponent,
      },
      {
        path: 'profile',
        component: AdminProfileComponent,
      },
      {
        path: 'suppliers',
        component: SupplierComponent,
      },
      {
        path: 'farmers',
        component: FarmersComponent,
      },
      {
        path: 'course',
        component: CoursesComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
