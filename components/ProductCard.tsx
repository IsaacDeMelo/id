import React from 'react';
import { Product } from '../types';
import Button from './Button';
import { PlusCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-stone-900 border border-stone-800 rounded-lg overflow-hidden flex flex-col hover:border-gold/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
        />
        <div className="absolute top-2 right-2 bg-stone-950/80 backdrop-blur-sm px-2 py-1 rounded border border-stone-700 text-xs uppercase tracking-wider text-gold">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-serif text-lg font-bold text-stone-100 mb-1 leading-tight group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-stone-400 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-800">
          <span className="font-serif text-xl font-bold text-gold">
            {product.price} <span className="text-xs text-stone-500 ml-0.5">PO</span>
          </span>
          <Button size="sm" onClick={() => onAddToCart(product)}>
            <PlusCircle size={16} />
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
