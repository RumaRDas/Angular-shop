import { ProductModelServer } from './../models/product.model';
import { NavigationExtras, Router } from '@angular/router';
import { CartModelServer, CartModelPublic } from './../models/cart.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, ɵLocaleDataIndex } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

//always use cartDataServer instade of cartClientServer cause haker can change localstorage
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
      // Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach((p) => {
        this.productService
          .getSingleProduct(p.id)
          .subscribe((actualProductInfo: ProductModelServer) => {
            if (this.cartDataServer.data[0].numInCart === 0) {
              this.cartDataServer.data[0].numInCart = p.incart;
              this.cartDataServer.data[0].product = actualProductInfo;

              // TODO
              /**Create Calculator Function and replace it here */
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
              //CART data server already has some entry in it
              this.cartDataServer.data.push({
                numInCart: p.incart,
                product: actualProductInfo,
              });
              // TODO
              /**Create Calculator Function and replace it here */
              //UPDATE LOCAL STORAGE
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({ ...this.cartDataServer });
          });
      });
    }
  } //
  //(quantity?: number )  means may set or not
  AddProductToCart(id: number, quantity?: number) {
    this.productService.getSingleProduct(id).subscribe((prod) => {
      // 1. If the cart is empty
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart =
          quantity !== undefined ? quantity : 1;
        //TODO
        /**Create Calculator Function and replace it here */
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        //Update localstorage
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ...this.cartDataServer });

        // TODO DiSplay a toast Notifications
      }
      // END of IF
      // 2. if the cart has some items
      else {
        let index = this.cartDataServer.data.findIndex((p) => {
          p.product.id === prod.id;
        }); //-1 or a positive value

        //  a) if that item is already in the cart => index is positive value
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.quantity) {
            this.cartDataServer.data[index].numInCart =
              this.cartDataServer.data[index].numInCart < prod.quantity
                ? quantity
                : prod.quantity;
          } else {
            this.cartDataServer.data[index].numInCart < prod.quantity
              ? this.cartDataServer.data[index].numInCart++
              : prod.quantity;
          }
          //storing in local
          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[
            index
          ].numInCart;
          //TODO DiSplay a toast Notifications
        } //end of if
        //  b) if that item is not in the cart array
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1,
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id,
          });
          //TODO DiSplay a toast Notifications
          //TODO
          /**Create Calculator Function and replace it here */
          this.cartDataClient.total = this.cartDataServer.total;
          //updating localstorage
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({ ...this.cartDataServer });
        } //end of else
      }
    });
  } //End of  AddProductToCart
  UpdateCartItems(index, increase: boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      data.numInCart < data.product.quantity
        ? data.numInCart++
        : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      //TODO
      /**Create Calculator Function and replace it here */
      this.cartDataClient.total = this.cartDataServer.total;
      //updating localstorage
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({ ...this.cartDataServer });
    } //End Of IF
    else {
      data.numInCart--;
      if (data.numInCart < 1) {
        // TODO Delete the Product from CART
        this.cartData$.next({ ...this.cartDataServer });
      } //End of if
      else {
        this.cartData$.next({ ...this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.numInCart;
        /**Create Calculator Function and replace it here */
        this.cartDataClient.total = this.cartDataServer.total;
        //updating localstorage
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } //end of else
    } //End of ELSE
  } //End of UpdateCartItem
  DeleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      /**Create Calculator Function and replace it here */
      this.cartDataClient.total = this.cartDataServer.total;
      if (this.cartDataClient.total === 0) {
        this.cartDataClient = { total: 0, prodData: [{ incart: 0, id: 0 }] };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          total: 0,
          data: [{ product: undefined, numInCart: 0 }],
        };
        this.cartData$.next({ ...this.cartDataServer });
      } else {
      }
      this.cartData$.next({ ...this.cartDataServer });
    } //endofif
    else {
      // If the user doesn't want to delete the product, hits the CANCEL button
      return;
    } // end ofelse
  } // End Of   DeleteProductFromCart

  CheckoutFromCart(userId: number) {
    this.http
      .post(`${this.serverUrl}/orders/payment`, null)
      .subscribe((res: { success: boolean }) => {
        if (res.success) {
          this.resetServaerData();
          this.http
            .post(`${this.serverUrl}/orders/new`, {
              userId: userId,
              products: this.cartDataClient.prodData,
            })
            .subscribe((data: OrderResponse) => {
              this.orderService.getSingleOrder(data.order_id).then((prods) => {
                if (data.success) {
                  const navigationExtras: NavigationExtras = {
                    state: {
                      message: data.message,
                      products: prods,
                      orderId: data.order_id,
                      total: this.cartDataClient.total,
                    },
                  };
                  //TODO HIDE SPINNER
                  this.router
                    .navigate(['/thankyou'], navigationExtras)
                    .then((p) => {
                      this.cartDataClient = {
                        total: 0,
                        prodData: [{ incart: 0, id: 0 }],
                      };
                      this.cartTotal$.next(0);
                      localStorage.setItem(
                        'cart',
                        JSON.stringify(this.cartDataClient)
                      );
                    });
                } else {
                }
              });
            });
        } else {
        }
      });
  } //End of   CheckoutFromCart()

  private CalculateTotal() {
    let Total = 0;
    this.cartDataServer.data.forEach((p) => {
      const { numInCart } = p;
      const { price } = p.product;
      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  } // End of CalculateTotal()

  private resetServaerData() {
    this.cartDataServer = {
      total: 0,
      data: [{ product: undefined, numInCart: 0 }],
    };
    this.cartData$.next({ ...this.cartDataServer });
  } // End of resetServaerData()
}

interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [
    {
      id: string;
      numIncart: string;
    }
  ];
}
