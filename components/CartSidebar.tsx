
import { CartItem } from '../types';
import Button from './Button';
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  userBudget: number;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-stone-900 border-l border-stone-700 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-stone-700 flex justify-between items-center bg-stone-900">
          <h2 className="font-serif text-xl text-gold flex items-center gap-2">
            <ShoppingCart className="text-gold" size={20} />
            Sua Algibeira
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-500 gap-4">
              <div className="w-16 h-16 border-2 border-stone-700 rounded-full flex items-center justify-center">
                <ShoppingCart size={32} className="opacity-20" />
              </div>
              <p className="font-serif italic text-sm">Sua algibeira está vazia, aventureiro.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="bg-stone-800/50 rounded-lg p-3 flex gap-3 border border-stone-700/50 group hover:border-gold/30 transition-colors">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover bg-stone-900 border border-stone-700" />
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-stone-200 text-sm group-hover:text-gold transition-colors">{item.name}</h4>
                  <p className="text-gold text-sm font-bold">{item.price} PO</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-stone-950 rounded border border-stone-700 px-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 text-stone-400 hover:text-white disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-mono w-6 text-center text-stone-300">{item.quantity}</span>
                      <button 
                         onClick={() => onUpdateQuantity(item.id, 1)}
                         className="p-1 text-stone-400 hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-stone-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-700 bg-stone-800">
          <div className="flex justify-between items-center mb-6">
            <span className="text-stone-400 font-serif uppercase tracking-wider text-xs">Total da Jornada</span>
            <span className="font-serif text-2xl text-gold font-black">{total} PO</span>
          </div>
          
          <Button 
            className="w-full py-4" 
            size="lg" 
            disabled={items.length === 0}
            onClick={onCheckout}
          >
            Prosseguir para Pagamento
          </Button>
          <p className="text-[10px] text-stone-500 mt-4 text-center italic">
            Você definirá seu saldo na próxima etapa.
          </p>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
