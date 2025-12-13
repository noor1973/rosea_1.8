
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images: string[];
  description: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum Category {
  RIBBONS = 'أشرطة الساتان',
  WRAPPING = 'تغليف وتزيين',
  TOOLS = 'أدوات ومعدات',
  ACCESSORIES = 'اكسسوارات',
  BOUQUETS = 'باقات جاهزة',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, never store plain text passwords on client
  createdAt: string;
}

export interface CustomerDetails {
  fullName: string;
  governorate: string;
  landmark: string;
  phone: string;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: CartItem[];
  totalPrice: number;
  date: string;
  status: 'new' | 'processing' | 'shipped' | 'completed' | 'cancelled';
}

export interface SiteContent {
  about: string;
  terms: string;
  privacy: string;
  returns: string;
  faq: { question: string; answer: string }[];
}
