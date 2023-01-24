import { CartItem } from './cart-item';

export class OrderItem {
  image_url!: string;
  unit_price!: number;
  quantity!: number;
  product_id: number;

  constructor(cartItem: CartItem) {
    this.image_url = cartItem.image_url;
    this.product_id = cartItem.id;
    this.quantity = cartItem.quantity;
    this.unit_price = cartItem.unit_price;
  }
}
