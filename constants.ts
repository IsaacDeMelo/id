
import { StoreConfig } from './types';

export const DEFAULT_CONFIG: StoreConfig = {
  id: 'default',
  slug: 'emporio-padrao',
  storeName: 'O Empório do Dragão Dourado',
  storeTagline: 'Fornecedor Oficial do Reino',
  theme: {
    primaryColor: '#d4af37',
    backgroundColor: '#0c0a09',
    cardColor: '#1c1917',
    parchmentColor: '#f5e6c8',
    inkColor: '#3a2a1d',
    borderRadius: '8px',
    fontFamily: 'Cinzel'
  },
  products: [
    {
      id: '1',
      name: 'Espada Longa do Valente',
      description: 'Uma lâmina de aço forjada por anões. Equilibrio perfeito para combate.',
      price: 150,
      category: 'weapon',
      image: 'https://images.unsplash.com/photo-1589131008221-9fd440d91814?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: '2',
      name: 'Poção de Vida Maior',
      description: 'Restaura 50 pontos de vida instantaneamente. Gosto de cereja amarga.',
      price: 45,
      category: 'potion',
      image: 'https://images.unsplash.com/photo-1514467958571-337553f19114?auto=format&fit=crop&q=80&w=400'
    }
  ]
};

export const FLAVOR_TEXTS = [
  "Obrigado pela preferência. Cuidado com os goblins na saída!",
  "Não aceitamos devoluções caso o item seja amaldiçoado.",
  "O Empório agradece. Que seus dados rolem 20!",
  "A garantia expira assim que você sai da masmorra."
];

export const CHARACTER_CLASSES = [
  'Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Bardo', 'Paladino', 'Ranger', 'Feiticeiro'
];
