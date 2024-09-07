import { Product } from "./product";

export interface CartItem {
  id: number | string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
