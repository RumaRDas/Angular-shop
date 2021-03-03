import { CartModelServer } from './../../models/cart.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { OrderService } from './../../services/order.service';
import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartTotal: number;
  cartData: CartModelServer;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data) => (this.cartData = data));
    this.cartService.cartTotal$.subscribe((total) => (this.cartTotal = total));
  }

  onCheckout() {
    this.spinner.show().then((p) => {
      this.cartService.CheckoutFromCart(2);
    });

    /** spinner ends after 5 seconds */
  }
}
