import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Espada Longa do Valente',
    description: 'Uma lâmina de aço forjada por anões. Equilibrio perfeito para combate.',
    price: 150,
    category: 'weapon',
    image: 'https://picsum.photos/id/1043/400/300' // Placeholder
  },
  {
    id: '2',
    name: 'Escudo da Muralha de Ferro',
    description: 'Robusto e pesado, capaz de parar flechas e golpes de orcs.',
    price: 120,
    category: 'armor',
    image: 'https://picsum.photos/id/1069/400/300'
  },
  {
    id: '3',
    name: 'Poção de Vida Maior',
    description: 'Restaura 50 pontos de vida instantaneamente. Gosto de cereja amarga.',
    price: 45,
    category: 'potion',
    image: 'https://picsum.photos/id/1080/400/300'
  },
  {
    id: '4',
    name: 'Capa da Invisibilidade (Usada)',
    description: 'Funciona 50% do tempo. A outra metade você parece um fantasma.',
    price: 500,
    category: 'misc',
    image: 'https://picsum.photos/id/1059/400/300'
  },
  {
    id: '5',
    name: 'Machado de Duas Mãos',
    description: 'Requer força 16 para empunhar. Causa dano massivo em estruturas.',
    price: 200,
    category: 'weapon',
    image: 'https://picsum.photos/id/1050/400/300'
  },
  {
    id: '6',
    name: 'Elixir de Mana',
    description: 'Brilha no escuro. Recarrega seus slots de magia.',
    price: 60,
    category: 'potion',
    image: 'https://picsum.photos/id/1020/400/300'
  },
  {
    id: '7',
    name: 'Armadura de Couro Batido',
    description: 'Leve e silenciosa. A favorita dos ladinos da guilda das sombras.',
    price: 90,
    category: 'armor',
    image: 'https://picsum.photos/id/1033/400/300'
  },
  {
    id: '8',
    name: 'Kit de Aventureiro',
    description: 'Corda, tochas, rações secas e pederneira. O básico para sobreviver.',
    price: 15,
    category: 'misc',
    image: 'https://picsum.photos/id/1015/400/300'
  }
];

export const FLAVOR_TEXTS = [
  "Obrigado pela preferência. Cuidado com os goblins na saída!",
  "Não aceitamos devoluções caso o item seja amaldiçoado.",
  "O Empório do Dragão Dourado agradece. Que seus dados rolem 20!",
  "Mantenha a lâmina afiada e a poção à mão.",
  "Se encontrar um dragão, lembre-se: nós vendemos extintores mágicos.",
  "A garantia expira assim que você sai da masmorra.",
  "Dizem que este item pertenceu a um rei... ou a um bardo mentiroso.",
  "Obrigado! Use com sabedoria (ou imprudência, não julgamos)."
];

export const CHARACTER_CLASSES = [
  'Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Bardo', 'Paladino', 'Ranger', 'Feiticeiro'
];
