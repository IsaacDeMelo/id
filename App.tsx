import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Coins } from 'lucide-react';
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
  const [userBudget, setUserBudget] = useState<number>(0); 
  
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

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const remainingGold = userBudget - cartTotal;

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
    if (remainingGold < 0) {
      alert("Você não tem ouro suficiente para pagar essa conta!");
      return;
    }
    setView('INVOICE');
  };

  const resetShop = () => {
    setCart([]);
    setCustomer({ name: '', characterClass: CHARACTER_CLASSES[0], guild: '' });
    setUserBudget(0);
    setView('SHOP');
  };

  return (
    <div className="min-h-screen bg-stone-950 pb-20 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setView('SHOP')}
          >
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
               <span className="text-stone-950 text-2xl font-serif font-black">D</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-gold text-lg font-bold leading-none">O Empório</h1>
              <span className="text-stone-500 text-[10px] uppercase tracking-widest">do Dragão Dourado</span>
            </div>
          </div>

          {/* Right Actions (Validator & Cart) */}
          <div className="flex items-center gap-2 md:gap-6">
            <button 
                onClick={() => setIsValidatorOpen(true)}
                className="flex items-center gap-2 text-stone-500 hover:text-gold transition-all duration-300 p-2"
                title="Validar Recibo"
              >
                <ShieldCheck size={24} className="md:w-5 md:h-5" />
                <span className="hidden md:inline text-sm font-serif">Validar Recibo</span>
            </button>

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
             <div className="mb-10 text-center">
               <h2 className="font-serif text-3xl md:text-5xl text-stone-100 mb-3">Equipamentos Lendários</h2>
               <p className="text-stone-400 max-w-lg mx-auto text-sm md:text-base">
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
          <div className="max-w-lg mx-auto bg-stone-900 border border-stone-800 p-6 md:p-8 rounded-lg shadow-2xl animate-fade-in">
            <h2 className="font-serif text-2xl text-gold mb-2">Finalizar Transação</h2>
            <p className="text-stone-500 text-sm mb-6 border-b border-stone-800 pb-4">
              Identifique-se e declare seus bens para o fisco imperial.
            </p>
            
            <form onSubmit={handleFinalizePurchase} className="space-y-5">
              <div>
                <label className="block text-stone-400 text-xs mb-2 uppercase tracking-widest font-bold">Nome do Aventureiro</label>
                <input 
                  required
                  type="text" 
                  value={customer.name}
                  onChange={e => setCustomer({...customer, name: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200 focus:border-gold focus:outline-none transition-all"
                  placeholder="Ex: Boromir de Gondor"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 text-xs mb-2 uppercase tracking-widest font-bold">Classe</label>
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
                  <label className="block text-stone-400 text-xs mb-2 uppercase tracking-widest font-bold">Ouro na Bolsa (PO)</label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50" size={16} />
                    <input 
                      required
                      type="number" 
                      min="0"
                      value={userBudget || ''}
                      onChange={e => setUserBudget(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-700 rounded p-3 pl-10 text-gold font-mono focus:border-gold focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 text-xs mb-2 uppercase tracking-widest font-bold">Guilda (Opcional)</label>
                <input 
                  type="text" 
                  value={customer.guild}
                  onChange={e => setCustomer({...customer, guild: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200 focus:border-gold focus:outline-none"
                  placeholder="Ex: Sociedade do Anel"
                />
              </div>

              {/* Summary Area */}
              <div className="bg-stone-950/50 p-4 rounded-md border border-stone-800 space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Total da Compra:</span>
                  <span className="text-stone-300 font-bold">{cartTotal} PO</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Seu Ouro:</span>
                  <span className="text-gold font-bold">{userBudget} PO</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-stone-800">
                  <span className="text-xs uppercase font-bold text-stone-400">Saldo Final:</span>
                  <span className={`text-lg font-serif font-bold ${remainingGold >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {remainingGold} PO
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setView('SHOP')}>
                  Voltar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={remainingGold < 0 || !customer.name}
                >
                  {remainingGold < 0 ? 'Ouro Insuficiente' : 'Gerar Nota Fiscal'}
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
            userBudget={userBudget}
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
        userBudget={userBudget}
      />

      <ValidatorModal 
        isOpen={isValidatorOpen} 
        onClose={() => setIsValidatorOpen(false)} 
      />
    </div>
  );
}

export default App;