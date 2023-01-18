import { Product } from './product';

export class CartItem {
  id: number;
  name: string;
  description: string;
  image_url: string;
  unit_price: number;
  quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.image_url = product.image_url;
    this.unit_price = product.unit_price;
    this.quantity = 1;
  }
}
