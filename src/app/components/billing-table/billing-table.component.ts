import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/service/billing.service';
import { Transaction } from './interface/transaction.interface';

@Component({
  selector: 'app-billing-table',
  templateUrl: './billing-table.component.html',
  styleUrls: ['./billing-table.component.scss']
})
export class BillingTableComponent implements OnInit {
  public columns = [
    { name: 'Customer', prop: "customer_name", width: 250 },
    { name: 'email', prop: "customer_email", width: 250 },
    { name: 'Currency', prop: "currency", width: 250 },
    { name: 'Cerdit card ype', prop: "cerdit_card_type", width: 250 },
    { name: 'Cerdit card number', prop: "cerdit_card_number", width: 250 },
    { name: 'Total price', prop: "total_price", width: 250 }
  ]
  
  public rows: Transaction[] = [];
  public loadTable: boolean = false;

  constructor(private billingService: BillingService) { }

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

  }
}
