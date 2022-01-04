import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/service/customer.service';
import { TransactionService } from 'src/app/service/transaction.service';
import { Customer } from '../../interface/customer.interface';
import { Transaction } from '../../interface/transaction.interface';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  public transactionForm: FormGroup;
  public loadForm: boolean
  public customers: Customer[];

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transactionService: TransactionService,
    private customerService: CustomerService) { }

  ngOnInit(): void {
    this.transactionForm = this.formBuilder.group({
      totalPrice: [this.data.displayTransaction?.total_price || 0, [Validators.required]],
      currency: [this.data.displayTransaction?.currency || '', [Validators.required]],
      cerditCardType: [this.data.displayTransaction?.cerdit_card_type || '', [Validators.required]],
      cerditCardNumber: [this.data.displayTransaction?.cerdit_card_number || 0, [Validators.required]],
      customer_id: [this.data.displayTransaction?.customer_id || '', [Validators.required]]
    });

    this.getAllCustomers();
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

    if (this.data.action === 'add') {
      this.createTransaction(transaction);
    }
    else {
      this.editTransaction(transaction);
    }
  }

  private getAllCustomers() {
    this.customerService.getAllCustomers().subscribe((customers: Customer[]) => {
      this.customers = customers;
      this.loadForm = true;

    }, error => console.log("error", error))
  }

  private editTransaction(transaction: Transaction): void {
    this.transactionService.editTransaction(this.data.displayTransaction._id, transaction).subscribe(() => {
      this.returnDisplayTransaction(transaction);
    }, error => console.log("error", error))
  }

  private createTransaction(transaction: Transaction): void {
    this.transactionService.createTransaction(transaction).subscribe(() => {
      this.returnDisplayTransaction(transaction);
    }, error => console.log("error", error))
  }

  private returnDisplayTransaction(transaction: Transaction){
    const customer = this.customers.find(c => c._id === transaction.customer_id);
      this.dialogRef.close({
        ...transaction,
        customer_name: `${customer.first_name} ${customer.last_name}`,
        customer_email: customer.email
      });
  }
}