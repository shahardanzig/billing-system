import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BillingService } from 'src/app/service/billing.service';
import { Transaction } from './interface/transaction.interface';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  public transactionForm: FormGroup;
  public loadForm: boolean
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private billingService: BillingService) { }

  ngOnInit(): void {
    this.transactionForm = this.formBuilder.group({
      totalPrice: [0, [Validators.required]],
      currency: ['', [Validators.required]],
      cerditCardType: ['', [Validators.required]],
      cerditCardNumber: [0, [Validators.required]],
      customer_id: ['', [Validators.required]]
    });

    this.loadForm = true;
  }

  get formControls() {
    return this.transactionForm.controls;
  }

  public submit() {
    if (this.transactionForm.invalid) {
      return;
    }

    const form = this.transactionForm.value;
    const transaction: Transaction = {
      customer_id: form.customer_id,
      cerdit_card_number: form.cerditCardNumber,
      currency: form.currency,
      cerdit_card_type: form.cerditCardType,
      total_price: form.totalPrice,
    }
    
    this.billingService.createTransaction(transaction).subscribe(savedTransaction => {
      const customer = this.data.customers.find(c => c._id === savedTransaction.customer_id);
      this.dialogRef.close({
        ...transaction,
        customer_name: customer.name,
        customer_email: customer.email
      });
    }, error => console.log("error", error))
  }
}