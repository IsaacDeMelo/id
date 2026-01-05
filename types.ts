export type Category = 'weapon' | 'armor' | 'potion' | 'misc';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  characterClass: string;
  guild?: string;
}

export type ViewState = 'SHOP' | 'CHECKOUT' | 'INVOICE';
