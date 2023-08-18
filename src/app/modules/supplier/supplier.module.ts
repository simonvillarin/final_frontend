import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierMainComponent } from './pages/supplier-main/supplier-main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SupplierRoutingModule } from './supplier-routing.module';

@NgModule({
  declarations: [SupplierMainComponent, DashboardComponent],
  imports: [CommonModule, SharedModule, SupplierRoutingModule],
})
export class SupplierModule {}
