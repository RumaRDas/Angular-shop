import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}
  showMessage() {
    console.log('New Products');
  }
}
