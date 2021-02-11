import { Router } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService
      .getAllProducts()
      .subscribe((prods: { count: Number; products: any[] }) => {
        this.products = prods.products;
        console.log(this.products);
      });
  }
  selectProduct(id: Number) {
    this.router.navigate(['/product', id]).then(); //take on that page
  }
}
