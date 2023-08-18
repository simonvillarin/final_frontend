import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, NavComponent],
  imports: [CommonModule, InputTextModule, InputTextareaModule, ButtonModule],
  exports: [
    NavbarComponent,
    FooterComponent,
    NavComponent,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
  ],
})
export class SharedModule {}
