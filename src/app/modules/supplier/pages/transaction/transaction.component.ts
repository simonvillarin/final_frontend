import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  methodForm: FormGroup;
  
  error = false;
  type: string = '';

  constructor(
    private fb: FormBuilder,
  ) {
    this.methodForm = this.fb.group({
      method: ['']
    });
  }

  ngOnInit(): void {
 
  }

  onMethodChange = (method: string) => {
    if (method != '') {
      this.error = false;
      this.methodForm.patchValue({
        method: method,
      });
    }
  };
}
