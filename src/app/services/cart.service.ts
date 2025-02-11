import { Injectable } from '@angular/core';
import {Product} from '../common/product';
import {CartItem} from '../common/cart-item';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[]=[];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() { }

  addToCart(cartItem: CartItem) {
    let existInCart:boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem == cartItem) {
          existingCartItem = cartItem;
          break;
        }
      }
      existInCart = (existingCartItem != undefined);
    }

    if (existInCart)
      existingCartItem.quantity ++;
    else
      this.cartItems.push(cartItem);

    this.computeCartTotals();
  }

  private computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalPriceValue);

  }
}
