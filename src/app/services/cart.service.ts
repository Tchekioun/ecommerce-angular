import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) this.remove(theCartItem);
    else this.computeCartTotals();
  }
  remove(theCartItem: CartItem) {
    //get the index of the item in the array
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );

    console.log(`item index is ${itemIndex}`);

    //if found, remouve it
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() {}

  addToCart(theCartItem: CartItem) {
    //check if we alreay have the item in our cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;
    if (this.cartItems.length > 0) {
      //find the item in the cart based on the item id

      existingCartItem = this.cartItems.find(
        (cartItem) => cartItem.id === theCartItem.id
      );
      //check if we found the giving the item

      alreadyExistInCart = existingCartItem != undefined;
    }

    if (alreadyExistInCart) existingCartItem!.quantity++;
    else this.cartItems.push(theCartItem);

    //compute the total price and the total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unit_price * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the totalPrice and the TotalQuantity

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.unit_price * tempCartItem.quantity;
      console.log(
        `id: ${tempCartItem.id} name: ${tempCartItem.name} subtotalPrice: ${totalPriceValue},  quantity: ${tempCartItem.quantity}`
      );
    }
    console.log(totalPriceValue.toFixed(2), totalQuantityValue);
    console.log('----------');
  }
}
