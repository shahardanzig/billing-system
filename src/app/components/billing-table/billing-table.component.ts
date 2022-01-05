import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransactionService } from '../../service/transaction.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { DisplayTransaction } from '../../interface/display-transaction.interface';
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../interface/customer.interface';

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
  private customers: Customer[] = [];

  constructor(
    private dialogService: MatDialog,
    private transactionService: TransactionService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.getAllTransactions();
    this.getAllCustomers();
  }

  public onSelect({ selected }) {
    this.selected = [];
    if (selected.length > 0)
      this.selected.push(selected[selected.length - 1]);
  }

  private getAllTransactions() {
    this.transactionService.getAllTransactions().subscribe(transactions => {
      this.rows = transactions;
      this.loadTable = true;
    }, error => {
      console.log("error", error)
    })
  }

  private getAllCustomers() {
    this.customerService.getAllCustomers().subscribe((customers: Customer[]) => {
      this.customers = customers;

    }, error => console.log("error", error))
  }

  public addTransaction() {

    const dialogRef = this.dialogService.open(TransactionFormComponent, {
      width: '500px',
      disableClose: true,
      data: {
        action: "add",
        customers: this.customers
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
        displayTransaction: this.selected[0],
        customers: this.customers
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

  public deleteTransaction() {
    this.transactionService.deleteTransaction(this.selected[0]._id).subscribe(() => {
      this.rows = this.rows.filter(row => row._id !== this.selected[0]._id);
      this.selected = [];
    }, error => console.log("error", error))
  }
}
