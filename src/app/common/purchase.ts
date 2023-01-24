import { Address } from './address';
import { Customer } from './customer';
import { Order } from './order';
import { OrderItem } from './order-item';

export class Purchase {
  customer!: Customer;
  shipping_address!: Address;
  billing_address!: Address;
  order!: Order;
  order_item!: OrderItem;
}
