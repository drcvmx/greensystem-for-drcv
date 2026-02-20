export interface CartItem {
  productId: string;
  brandId: string;
  brandName: string;
  flavorName: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}
