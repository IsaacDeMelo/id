
import { StoreConfig } from './types';

export const DEFAULT_CONFIG: StoreConfig = {
  id: 'default',
  slug: 'emporio-padrao',
  storeName: 'O Empório do Dragão Dourado',
  storeTagline: 'Fornecedor Oficial do Reino de Arton',
  theme: {
    primaryColor: '#d4af37',
    secondaryColor: '#1c1917',
    accentColor: '#facc15',
    backgroundColor: '#0c0a09',
    cardColor: '#1c1917',
    parchmentColor: '#f5e6c8',
    inkColor: '#3a2a1d',
    borderRadius: '12px',
    fontFamily: 'Cinzel',
    layoutType: 'grid',
    showBanner: true,
    bannerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1200',
    logoImage: '',
    glassmorphism: true
  },
  products: [
    {
      id: '1',
      name: 'Espada Longa do Valente',
      description: 'Uma lâmina de aço forjada por anões nas profundezas de Erebor.',
      price: 150,
      category: 'weapon',
      image: 'https://images.unsplash.com/photo-1589131008221-9fd440d91814?auto=format&fit=crop&q=80&w=400',
      rarity: 'uncommon'
    },
    {
      id: '2',
      name: 'Poção de Vida Maior',
      description: 'Restaura 50 pontos de vida. Contém extrato de erva-de-fogo.',
      price: 45,
      category: 'potion',
      image: 'https://images.unsplash.com/photo-1514467958571-337553f19114?auto=format&fit=crop&q=80&w=400',
      rarity: 'common'
    }
  ]
};

export const FLAVOR_TEXTS = [
  "Cuidado com os mímicos disfarçados de baús!",
  "Este recibo é válido em todos os planos materiais conhecidos.",
  "O Empório não se responsabiliza por perdas de membros em combate.",
  "Que a sorte dos dados acompanhe seus passos."
];

export const CHARACTER_CLASSES = [
  'Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Bardo', 'Paladino', 'Ranger', 'Druida', 'Monge'
];
