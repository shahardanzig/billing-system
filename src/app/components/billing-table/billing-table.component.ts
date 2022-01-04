import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BillingService } from 'src/app/service/billing.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { DisplayTransaction } from './interface/display-transaction.interface';

@Component({
  selector: 'app-billing-table',
  templateUrl: './billing-table.component.html',
  styleUrls: ['./billing-table.component.scss']
})
export class BillingTableComponent implements OnInit {
  public columns = [
    { name: 'Customer', prop: "customer_name", width: 250 },
    { name: 'Email', prop: "customer_email", width: 250 },
    { name: 'Currency', prop: "currency", width: 250 },
    { name: 'Cerdit card ype', prop: "cerdit_card_type", width: 250 },
    { name: 'Cerdit card number', prop: "cerdit_card_number", width: 250 },
    { name: 'Total price', prop: "total_price", width: 250 }
  ]

  public rows: DisplayTransaction[] = [];
  public loadTable: boolean = false;

  constructor(
    private dialogService: MatDialog,
    private billingService: BillingService
  ) { }

  ngOnInit(): void {
    this.getAllTransactions();
  }

  private getAllTransactions() {
    this.billingService.getAllTransactions().subscribe(transactions => {
      this.rows = transactions;
      this.loadTable = true;
    }, error => {
      console.log("error", error)
    })
  }

  public addTransaction() {
    const dialogRef = this.dialogService.open(TransactionFormComponent, {
      width: '500px',
      disableClose: true,
      data: {
        action: "add",
        customers: this.rows.map(row => ({ _id: row.customer_id, name: row.customer_name, email: row.customer_email }))
      }
    });
    dialogRef.afterClosed().subscribe((displayTransaction: DisplayTransaction) => {
      this.rows.push(displayTransaction);
    })
  }
}
