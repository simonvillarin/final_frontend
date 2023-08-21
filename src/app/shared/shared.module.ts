import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    MessagesModule,
    DialogModule,
    TableModule,
    ReactiveFormsModule,
    InputNumberModule,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    MessagesModule,
    DialogModule,
    TableModule,
    ReactiveFormsModule,
    InputNumberModule,
  ],
})
export class SharedModule {}
