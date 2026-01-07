
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

export interface StoreTheme {
  primaryColor: string; 
  backgroundColor: string; 
  cardColor: string; 
  parchmentColor: string; 
  inkColor: string; 
  borderRadius: string; 
  fontFamily: 'Cinzel' | 'Lato' | 'Serif' | 'Monospace';
}

export interface StoreConfig {
  id: string;
  slug: string; // Utilizado para url/slug.acdm.online
  storeName: string;
  storeTagline: string;
  theme: StoreTheme;
  products: Product[];
}

export type ViewState = 'HUB' | 'SHOP' | 'CHECKOUT' | 'INVOICE' | 'EDITOR';
