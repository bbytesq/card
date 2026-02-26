export interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  discount: number;
}

export interface CartItem extends Product {
  count: number;
}

export type Cart = CartItem[];


