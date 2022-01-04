import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  public getAllCustomers(): Observable<any> {
    return this.http.get('http://localhost:2000/customer/all');
  }

}
