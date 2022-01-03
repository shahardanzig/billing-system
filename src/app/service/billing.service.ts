import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: HttpClient) { }

  public getAllTransactions(): Observable<any> {
    return this.http.get('http://localhost:2000/transaction/all');
  }
}
