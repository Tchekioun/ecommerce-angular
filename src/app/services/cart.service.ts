import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() {}

  addToCart(theCartItem: CartItem) {
    //check if we alreay have the item in our cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem!: CartItem;
    if (this.cartItems.length > 0) {
      //find the item in the cart based on the item id
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
      //check if we found the giving the item

      alreadyExistInCart = existingCartItem != undefined;
    }

    if (alreadyExistInCart) existingCartItem.quanitity++;
    else this.cartItems.push(theCartItem);

    //compute the total price and the total quantity
  }
}
