import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/cart-item';
import {find} from 'rxjs';

@Component({
  selector: 'app-cart-details',
  standalone: false,

  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;




  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.listCartDetails();

  }


  private listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
    this.cartService.computeCartTotals();
  }

  incrementQuantity(cartItem: CartItem) {

    this.cartService.addToCart(cartItem);
    // cartItem.quantity++;
    // this.cartService.computeCartTotals();

  }

  decrementQuantity(cartItem: CartItem) {

    this.cartService.decrementQuantity(cartItem);
  }


  remove(cartItem: CartItem) {

    this.cartService.remove(cartItem);
  }






}
