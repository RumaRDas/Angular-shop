import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrderResponseModel } from '../models/oeder.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  serverUrl = environment.SERVER_URL;
  products: OrderResponseModel[] = [];

  constructor(private http: HttpClient) {}
  /*GET ORDER BY ID */
  getSingleOrder(orderId: number) {
    return this.http
      .get<OrderResponseModel[]>(this.serverUrl + '/orders' + orderId)
      .toPromise();
  }
}
