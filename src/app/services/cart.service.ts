import {Injectable, numberAttribute} from '@angular/core';
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
  constructor() {}

  addToCart(cartItem: CartItem) {

    let itemExist: boolean = false;

    if (this.cartItems.length == 0)
      this.cartItems.push(cartItem);
    else {
      const foundItem = this.cartItems.find(tempCartItem =>  tempCartItem.id === cartItem.id);
      if (foundItem != undefined)
        foundItem.quantity++;
      else
        this.cartItems.push(cartItem);
    }


    this.computeCartTotals();
  }

  public computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(Number(totalPriceValue.toFixed(2)));
    this.totalQuantity.next(totalQuantityValue);
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("content of the cart");
    for (let cartItem of this.cartItems) {
      let subtotal: number = cartItem.quantity * cartItem.unitPrice;
      console.log(`name=${cartItem.name}, quantity=${cartItem.quantity},
                   unitPrice=${cartItem.unitPrice}, subtotalPrice=${subtotal}`);
    }

    console.log(`totalPrice=${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    console.log('-------------');
  }


  decrementQuantity(cartItem: CartItem) {

    cartItem.quantity--;
    if (cartItem.quantity == 0)
      this.remove(cartItem);

    this.computeCartTotals();
  }


  remove(cartItem: CartItem) {

    let index: number = this.cartItems.findIndex(item => item.id === cartItem.id);
    if (index > -1)
      this.cartItems.splice(index,1);
    this.computeCartTotals();
  }





}
