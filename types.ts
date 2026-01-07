
export type Category = 'weapon' | 'armor' | 'potion' | 'misc' | 'scroll' | 'artifact';
export type LayoutType = 'grid' | 'list' | 'compact';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stock?: number;
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
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  parchmentColor: string;
  inkColor: string;
  borderRadius: string;
  fontFamily: 'Cinzel' | 'Lato' | 'Serif' | 'Monospace';
  layoutType: LayoutType;
  showBanner: boolean;
  bannerImage: string;
  logoImage: string;
  glassmorphism: boolean;
}

export interface StoreConfig {
  id: string;
  slug: string;
  storeName: string;
  storeTagline: string;
  theme: StoreTheme;
  products: Product[];
}

export type ViewState = 'HUB' | 'SHOP' | 'CHECKOUT' | 'INVOICE' | 'EDITOR';
