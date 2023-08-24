import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './modules/error/pages/not-found/not-found.component';
import { landingGuard } from './core/guards/landing/landing.guard';
import { supplierGuard } from './core/guards/supplier/supplier.guard';
import { adminGuard } from './core/guards/admin/admin.guard';
import { farmerGuard } from './core/guards/farmer/farmer.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/landing/landing.module').then((m) => m.LandingModule),
    canActivate: [landingGuard],
  },
  {
    path: 'supplier',
    loadChildren: () =>
      import('./modules/supplier/supplier.module').then(
        (m) => m.SupplierModule
      ),
    canActivate: [supplierGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [adminGuard],
  },
  {
    path: 'farmer',
    loadChildren: () =>
      import('./modules/farmer/farmer.module').then((m) => m.FarmerModule),
    canActivate: [farmerGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
