import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../interface/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  public getAllTransactions(): Observable<any> {
    return this.http.get('http://localhost:2000/transaction/all');
  }

  public createTransaction(transaction: Transaction): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://localhost:2000/transaction/create', transaction, { headers });
  }

  public editTransaction(transactionId: string, transaction: Transaction): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`http://localhost:2000/transaction/update/${transactionId}`, transaction, { headers });
  }

  public deleteTransaction(transactionId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(`http://localhost:2000/transaction/${transactionId}`);
  }
}
