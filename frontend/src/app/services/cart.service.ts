import { Router } from '@angular/router';
import { CartModelServer, CartModelPublic } from './../models/cart.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  serverUrl = environment.SERVER_URL;

  // // Data variable to store the cart information on the client's local storage(Dont save any password or any important information)
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [
      {
        incart: 0,
        id: 0,
      },
    ],
  };

  // Cart Data variable to store the cart information on the server(Angular frontend server not backend)
  // This will be sent to the backend Server as post data
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [
      {
        numInCart: 0,
        product: undefined,
      },
    ],
  };

  /** OBSERVABLES FOR THE COMPONENTS TO SUBSCRIBE */
  //$ sign after the name means its a observable  naming convention
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    //GET the information from local storage(if nay)
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    //Check if the info variable is null or has some data init
    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      // that means local Storage is not empty and has some information
      this.cartDataClient = info;
    }
  }
}
