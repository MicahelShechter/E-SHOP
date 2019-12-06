export interface Cart {
  _id: string;
  userId: string;
  date: Date;
  isOpen: boolean;
  products: [];
  status?: number;
  totalCartPrice: number;
  cart: Cart;
}
