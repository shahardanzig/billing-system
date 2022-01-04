import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  public selected: DisplayTransaction[] = [];
  public columns = [
    {
      sortable: false,
      canAutoResize: false,
      draggable: false,
      resizable: false,
      headerCheckboxable: false,
      checkboxable: true,
      width: 30
    },
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
    private billingService: BillingService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllTransactions();
  }

  public onSelect({ selected }) {
    this.selected = [];
    if (selected.length > 0)
      this.selected.push(selected[selected.length - 1]);
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
        customers: this.getUniqueCustomers()
      }
    });
    dialogRef.afterClosed().subscribe((displayTransaction: DisplayTransaction) => {
      if (displayTransaction) {
        this.rows.push(displayTransaction);
        this.rows = [...this.rows];
        this.selected = [];
      }
    })
  }

  public editTransaction() {
    const dialogRef = this.dialogService.open(TransactionFormComponent, {
      width: '500px',
      disableClose: true,
      data: {
        action: "edit",
        customers: this.getUniqueCustomers(),
        displayTransaction: this.selected[0]
      }
    });
    dialogRef.afterClosed().subscribe((displayTransaction: DisplayTransaction) => {
      if (displayTransaction) {
        const { cerdit_card_number, cerdit_card_type, currency, customer_email, customer_id, customer_name, total_price } = displayTransaction;

        let row = this.rows.find(row => this.selected[0]._id === row._id);
        row.cerdit_card_number = cerdit_card_number;
        row.cerdit_card_type = cerdit_card_type;
        row.currency = currency;
        row.customer_email = customer_email;
        row.customer_id = customer_id;
        row.customer_name = customer_name;
        row.total_price = total_price;

        this.selected = [];
      }
    })
  }

  private getUniqueCustomers() {
    return this.rows.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.customer_id === value.customer_id
      )
      ))
      .map(row => ({ _id: row.customer_id, name: row.customer_name, email: row.customer_email }));
  }

  public deleteTransaction() {
    this.billingService.deleteTransaction(this.selected[0].customer_id).subscribe(() => {
      this.rows = this.rows.filter(row => row.customer_id !== this.selected[0].customer_id);
      this.selected = [];
    }, error => console.log("error", error))
  }
}
