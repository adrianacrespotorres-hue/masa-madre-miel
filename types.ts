
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Panes' | 'Repostería' | 'Saludable';
  image: string;
  nutritionInfo?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
