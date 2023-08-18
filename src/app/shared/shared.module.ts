import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
  ],
})
export class SharedModule {}
