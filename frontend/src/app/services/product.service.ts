import { ProductModelServer } from './../models/product.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { serverResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = environment.SERVER_URL;
  constructor(private http: HttpClient) {}

  /*THIS IS TO FETCH ALL PRODUCTS FROM BACKEND SERVER: */
  getAllProducts(numberOfResults = 10): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.url + 'products', {
      params: {
        limit: numberOfResults.toString(),
      },
    });
  }
  /* GET SINGLE PRODUCT  FROM SERVER*/
  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.url + 'products/' + id);
  }

  /*GET PRODUCT FROM ONE CATEGORY */
  getProductFromCategory(catName: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(
      this.url + 'products/category/' + catName
    );
  }
}
