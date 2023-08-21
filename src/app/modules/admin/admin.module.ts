import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminMainComponent } from './pages/admin-main/admin-main.component';
import { FarmingTipsComponent } from './pages/farming-tips/farming-tips.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminMainComponent,
    FarmingTipsComponent,
    ComplaintsComponent,
  ],
  imports: [CommonModule, SharedModule, AdminRoutingModule],
})
export class AdminModule {}
