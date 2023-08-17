import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingRoutingModule } from './landing-routing.module';

@NgModule({
  declarations: [
    HeroComponent,
    AboutComponent,
    TestimonialsComponent,
    HomeComponent,
  ],
  imports: [CommonModule, LandingRoutingModule],
})
export class LandingModule {}
