import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingRoutingModule } from './landing-routing.module';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    HeroComponent,
    AboutComponent,
    TestimonialsComponent,
    HomeComponent,
    RegisterComponent,
  ],
  imports: [CommonModule, LandingRoutingModule, SharedModule],
})
export class LandingModule {}
