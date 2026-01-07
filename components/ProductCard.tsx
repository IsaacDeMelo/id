
import { Product, LayoutType } from '../types';
import Button from './Button';
import { PlusCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  layout: LayoutType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, layout }) => {
  const getRarityColor = (rarity?: string) => {
    switch(rarity) {
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#a855f7';
      case 'legendary': return '#f59e0b';
      default: return 'var(--primary-color)';
    }
  };

  if (layout === 'list') {
    return (
      <div className="flex items-center gap-6 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-gold/30 transition-all">
        <img src={product.image} className="w-24 h-24 rounded-xl object-cover border border-white/10" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-xl font-bold font-serif" style={{ color: 'var(--primary-color)' }}>{product.name}</h3>
             {product.rarity !== 'common' && <Sparkles size={12} style={{ color: getRarityColor(product.rarity) }} />}
          </div>
          <p className="text-stone-400 text-xs line-clamp-1 mb-2">{product.description}</p>
          <div className="flex items-center gap-4">
             <span className="text-xl font-black">{product.price} <span className="text-[10px] opacity-40">PO</span></span>
             <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded border" style={{ borderColor: getRarityColor(product.rarity), color: getRarityColor(product.rarity) }}>{product.rarity}</span>
          </div>
        </div>
        <Button size="sm" onClick={() => onAddToCart(product)} className="px-6 py-3">
          <PlusCircle size={18} /> Adicionar
        </Button>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden group hover:border-gold/30 transition-all text-center">
        <div className="h-32 overflow-hidden relative">
          <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-bold font-serif mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-gold font-black text-xs mb-3">{product.price} PO</p>
          <button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-gold/10 text-gold py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-gold hover:text-stone-950 transition-all"
          >
            Adicionar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group overflow-hidden flex flex-col transition-all duration-500 border border-white/5 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative"
      style={{ 
        backgroundColor: 'var(--card-color)',
        borderRadius: 'var(--border-radius)'
      }}
    >
      <div className="absolute top-4 left-4 z-10">
         <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10" style={{ color: getRarityColor(product.rarity) }}>
           {product.rarity}
         </span>
      </div>

      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow relative">
        <h3 className="text-2xl font-serif font-bold mb-2 leading-tight group-hover:text-gold transition-colors" style={{ color: 'var(--primary-color)' }}>
          {product.name}
        </h3>
        <p className="text-stone-400 text-sm mb-6 line-clamp-3 flex-grow font-sans italic opacity-70">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
          <span className="text-2xl font-black" style={{ color: 'var(--primary-color)' }}>
            {product.price} <span className="text-[11px] opacity-40 ml-0.5 uppercase tracking-widest">Ouro</span>
          </span>
          <Button size="md" onClick={() => onAddToCart(product)} className="px-6 py-3 rounded-xl">
            <PlusCircle size={18} /> Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
