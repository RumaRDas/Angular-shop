import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = environment.SERVER_URL;
  constructor(private http: HttpClient) {}

  /*THIS IS TO FETCH ALL PRODUCTS FROM BACKEND SERVER: */
  getAllProducts(numberOfResults = 10) {
    return this.http.get(this.url + 'products', {
      params: {
        limit: numberOfResults.toString(),
      },
    });
  }
}
