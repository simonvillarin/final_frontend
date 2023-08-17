import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './modules/landing/pages/landing/landing.component';
import { AboutComponent } from './modules/landing/components/about/about.component';
import { ContactComponent } from './modules/landing/components/contact/contact.component';
import { HeroComponent } from './modules/landing/components/hero/hero.component';

@NgModule({
  declarations: [AppComponent, LandingComponent, AboutComponent, ContactComponent, HeroComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
