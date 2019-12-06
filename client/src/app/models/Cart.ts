export interface Cart {
  _id: string;
  userId: string;
  date: Date;
  isOpen: boolean;
  products: [];
  status?: number;
  cartPrice: number;
  cart: Cart;
}
