import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [CommonModule, InputTextModule, InputTextareaModule],
  exports: [
    NavbarComponent,
    FooterComponent,
    InputTextModule,
    InputTextareaModule,
  ],
})
export class SharedModule {}
