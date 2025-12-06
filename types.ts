export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  details?: string; // New field for manual details
  image: string;
  colors: string[];
  category: string;
  stock: number; // New field for inventory count
}

export interface CartItem extends Product {
  cartId: string;
  selectedColor: string;
  quantity: number;
}

export type ViewMode = 'STORE' | 'ADMIN' | 'CART';

export interface AlertState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}
