
import { Product } from '../types';
import Button from './Button';
import { PlusCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div 
      className="group overflow-hidden flex flex-col transition-all duration-300 border border-stone-800 hover:shadow-2xl"
      style={{ 
        backgroundColor: 'var(--card-color)',
        borderRadius: 'var(--border-radius)'
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute top-2 right-2 bg-stone-950/80 backdrop-blur-sm px-2 py-1 text-[10px] uppercase tracking-wider" style={{ borderRadius: '4px', color: 'var(--primary-color)' }}>
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-1 leading-tight group-hover:text-gold transition-colors" style={{ color: 'var(--primary-color)' }}>
          {product.name}
        </h3>
        <p className="text-stone-400 text-xs mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-800">
          <span className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>
            {product.price} <span className="text-xs opacity-50 ml-0.5">PO</span>
          </span>
          <Button size="sm" onClick={() => onAddToCart(product)}>
            <PlusCircle size={16} /> Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
