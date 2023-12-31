import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminMainComponent } from './pages/admin-main/admin-main.component';
import { FarmingTipsComponent } from './pages/farming-tips/farming-tips.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { FarmersComponent } from './pages/farmers/farmers.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { CoursesComponent } from './pages/courses/courses.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminMainComponent,
    FarmingTipsComponent,
    ComplaintsComponent,
    AdminProfileComponent,
    SupplierComponent,
    FarmersComponent,
    CoursesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    ToggleButtonModule,
    InputSwitchModule,
    MatIconModule,
    ButtonModule,
    YouTubePlayerModule,
    ToastModule,
  ],
})
export class AdminModule {}
