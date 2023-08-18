import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingRoutingModule } from './landing-routing.module';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServicesComponent } from './components/services/services.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    HeroComponent,
    AboutComponent,
    HomeComponent,
    RegisterComponent,
    ServicesComponent,
    ContactsComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalendarModule,
  ],
})
export class LandingModule {}
