import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck } from 'lucide-react';
import { PRODUCTS, CHARACTER_CLASSES } from './constants';
import { CartItem, Product, ViewState, CustomerDetails } from './types';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import Invoice from './components/Invoice';
import Button from './components/Button';
import ValidatorModal from './components/ValidatorModal';

function App() {
  const [view, setView] = useState<ViewState>('SHOP');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  
  // Checkout State
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    characterClass: CHARACTER_CLASSES[0],
    guild: ''
  });

  // --- Cart Logic ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- Navigation Handlers ---
  const handleCheckoutStart = () => {
    setIsCartOpen(false);
    setView('CHECKOUT');
  };

  const handleFinalizePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim()) {
      alert("Por favor, identifique-se, aventureiro!");
      return;
    }
    setView('INVOICE');
  };

  const resetShop = () => {
    setCart([]);
    setCustomer({ name: '', characterClass: CHARACTER_CLASSES[0], guild: '' });
    setView('SHOP');
  };

  return (
    <div className="min-h-screen bg-stone-950 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-stone-950/80 backdrop-blur-md border-b border-stone-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setView('SHOP')}
          >
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5)]">
               <span className="text-stone-950 text-2xl font-serif font-black">D</span>
            </div>
            <div>
              <h1 className="font-serif text-gold text-lg md:text-xl font-bold leading-none">O Empório</h1>
              <span className="text-stone-500 text-xs uppercase tracking-widest">do Dragão Dourado</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Validator Trigger */}
             <button 
                onClick={() => setIsValidatorOpen(true)}
                className="hidden md:flex items-center gap-2 text-stone-500 hover:text-gold transition-colors text-sm"
              >
                <ShieldCheck size={18} />
                <span>Validar Recibo</span>
             </button>

            {/* Cart Trigger */}
            <button 
              className="relative p-2 text-stone-200 hover:text-gold transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={28} />
              {cartTotalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8">
        
        {/* VIEW: SHOP */}
        {view === 'SHOP' && (
          <div className="animate-fade-in">
             <div className="mb-8 text-center">
               <h2 className="font-serif text-3xl md:text-4xl text-stone-100 mb-2">Equipamentos Lendários</h2>
               <p className="text-stone-400 max-w-lg mx-auto">
                 De espadas vorpal a poções duvidosas. Temos tudo o que você precisa para sua próxima campanha suicida.
               </p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {PRODUCTS.map(product => (
                 <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart} 
                 />
               ))}
             </div>
          </div>
        )}

        {/* VIEW: CHECKOUT */}
        {view === 'CHECKOUT' && (
          <div className="max-w-lg mx-auto bg-stone-900 border border-stone-800 p-8 rounded-lg shadow-2xl animate-fade-in">
            <h2 className="font-serif text-2xl text-gold mb-6 border-b border-stone-700 pb-4">Quem é você?</h2>
            
            <form onSubmit={handleFinalizePurchase} className="space-y-6">
              <div>
                <label className="block text-stone-400 text-sm mb-2 uppercase tracking-wide">Nome do Personagem</label>
                <input 
                  required
                  type="text" 
                  value={customer.name}
                  onChange={e => setCustomer({...customer, name: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  placeholder="Ex: Aragorn, filho de Arathorn"
                />
              </div>

              <div>
                <label className="block text-stone-400 text-sm mb-2 uppercase tracking-wide">Classe</label>
                <select 
                  value={customer.characterClass}
                  onChange={e => setCustomer({...customer, characterClass: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200 focus:border-gold focus:outline-none"
                >
                  {CHARACTER_CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 text-sm mb-2 uppercase tracking-wide">Guilda (Opcional)</label>
                <input 
                  type="text" 
                  value={customer.guild}
                  onChange={e => setCustomer({...customer, guild: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200 focus:border-gold focus:outline-none"
                  placeholder="Ex: Os Escudeiros da Luz"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setView('SHOP')}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Gerar Nota Fiscal
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW: INVOICE */}
        {view === 'INVOICE' && (
          <Invoice 
            items={cart} 
            customer={customer} 
            onBack={resetShop} 
          />
        )}
      </main>

      {/* Overlays */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckoutStart}
      />

      <ValidatorModal 
        isOpen={isValidatorOpen} 
        onClose={() => setIsValidatorOpen(false)} 
      />
    </div>
  );
}

export default App;
