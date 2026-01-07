
import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Hammer, Plus, ArrowLeft, Trash2, ExternalLink, Globe, Copy, CheckCircle2, CloudLightning, ShieldCheck, Sparkles } from 'lucide-react';
import { DEFAULT_CONFIG, CHARACTER_CLASSES } from './constants';
import { CartItem, ViewState, CustomerDetails, StoreConfig } from './types';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import Invoice from './components/Invoice';
import Button from './components/Button';
import ValidatorModal from './components/ValidatorModal';
import EditorPanel from './components/EditorPanel';

const API_URL = '/api';

const StoreService = {
  async getStores(): Promise<StoreConfig[]> {
    try {
      const res = await fetch(`${API_URL}/stores`);
      if (!res.ok) return [{ ...DEFAULT_CONFIG, id: 'default' }];
      return res.json();
    } catch {
      return [{ ...DEFAULT_CONFIG, id: 'default' }];
    }
  },
  async saveStore(store: StoreConfig) {
    const res = await fetch(`${API_URL}/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(store)
    });
    return res.json();
  },
  async deleteStore(id: string) {
    await fetch(`${API_URL}/stores/${id}`, { method: 'DELETE' });
  }
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stores, setStores] = useState<StoreConfig[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>('HUB');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await StoreService.getStores();
        setStores(data);
        
        const params = new URLSearchParams(window.location.search);
        const storeSlugParam = params.get('s');
        setIsAdmin(params.get('role') === 'adm');

        if (storeSlugParam) {
          const found = data.find(s => s.slug === storeSlugParam);
          if (found) {
            setActiveStoreId(found.id);
            setView('SHOP');
          }
        }
      } catch (e) {
        console.error("Erro ao carregar lojas:", e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const activeStore = useMemo(() => 
    stores.find(s => s.id === activeStoreId) || stores[0] || DEFAULT_CONFIG
  , [stores, activeStoreId]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [userBudget, setUserBudget] = useState<number>(0); 
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    characterClass: CHARACTER_CLASSES[0]
  });

  useEffect(() => {
    if (view !== 'HUB' && activeStore) {
      const root = document.documentElement;
      const theme = activeStore.theme;
      root.style.setProperty('--primary-color', theme.primaryColor);
      root.style.setProperty('--bg-color', theme.backgroundColor);
      root.style.setProperty('--card-color', theme.cardColor);
      root.style.setProperty('--parchment-color', theme.parchmentColor);
      root.style.setProperty('--ink-color', theme.inkColor);
      root.style.setProperty('--border-radius', theme.borderRadius);
      root.style.setProperty('--store-font', theme.fontFamily === 'Monospace' ? 'monospace' : theme.fontFamily);
    }
  }, [activeStore, view]);

  const createNewStore = async () => {
    const id = Date.now().toString();
    const newStore: StoreConfig = {
      ...DEFAULT_CONFIG,
      id,
      slug: `loja-${id.slice(-4)}`,
      storeName: 'Novo Domínio Arcano',
    };
    setIsSaving(true);
    const saved = await StoreService.saveStore(newStore);
    setStores([...stores, saved]);
    setActiveStoreId(saved.id);
    setIsEditorOpen(true);
    setIsSaving(false);
  };

  const updateActiveStore = (newConfig: StoreConfig) => {
    setStores(stores.map(s => s.id === newConfig.id ? newConfig : s));
  };

  const handleSave = async () => {
    if (!activeStore) return;
    setIsSaving(true);
    try {
      await StoreService.saveStore(activeStore);
      setIsEditorOpen(false);
    } catch (e) {
      alert("Erro ao salvar no MongoDB. Verifique sua conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteStore = async (id: string) => {
    if (!confirm("Esta ação destruirá o domínio permanentemente do plano material (DB). Prosseguir?")) return;
    await StoreService.deleteStore(id);
    setStores(stores.filter(s => s.id !== id));
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/?s=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0c0a09] flex flex-col items-center justify-center text-gold gap-6">
      <div className="relative">
        <CloudLightning className="animate-pulse text-gold" size={64} />
        <Sparkles className="absolute -top-2 -right-2 animate-bounce text-yellow-400" size={24} />
      </div>
      <span className="font-serif tracking-[0.3em] text-sm animate-pulse uppercase">Conjurando Banco de Dados...</span>
    </div>
  );

  if (view === 'HUB') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-gold/30">
        <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 h-20 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-slate-950 font-serif font-black text-xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">S</div>
            <div>
              <span className="font-serif text-2xl tracking-tight text-white block leading-none">ScribeForge</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">NoCode Store Engine</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsValidatorOpen(true)}
              className="text-slate-400 hover:text-gold transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 group"
            >
              <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Validar Recibo</span>
            </button>
            <div className="h-6 w-[1px] bg-white/10"></div>
            {isAdmin ? (
              <div className="flex items-center gap-2 text-[10px] text-green-400 font-bold uppercase bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Cluster0 Live
              </div>
            ) : (
              <a href="?role=adm" className="text-stone-500 hover:text-white text-xs font-bold uppercase tracking-widest border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-all">Modo Mestre</a>
            )}
          </div>
        </nav>

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <div>
              <h2 className="text-4xl font-serif font-bold text-white mb-2">Seus Domínios</h2>
              <p className="text-slate-500 text-sm max-w-md">Gerencie suas instâncias de venda RPG sincronizadas com o Cluster0.</p>
            </div>
            {isAdmin && (
              <button onClick={createNewStore} disabled={isSaving} className="bg-gold text-slate-950 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/20">
                <Plus size={20} /> CRIAR NOVO DOMÍNIO
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map(store => (
              <div key={store.id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-gold/40 transition-all group hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center text-gold border border-white/5 group-hover:scale-110 transition-transform">
                    <Globe size={28} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => deleteStore(store.id)} className="p-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-1">{store.storeName}</h3>
                <div className="flex items-center gap-2 text-gold text-[11px] font-mono mb-8 opacity-60 group-hover:opacity-100 transition-opacity">
                   {store.slug}.acdm.online
                   <button onClick={() => copyToClipboard(store.slug)} className="text-slate-600 hover:text-white p-1">
                      {copiedSlug === store.slug ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                   </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { setActiveStoreId(store.id); setView('SHOP'); }} className="bg-white/5 py-3 rounded-xl text-white font-bold text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/5">
                    <ExternalLink size={16} /> Ver Loja
                  </button>
                  {isAdmin && (
                    <button onClick={() => { setActiveStoreId(store.id); setIsEditorOpen(true); }} className="bg-gold/10 py-3 rounded-xl text-gold font-bold text-xs hover:bg-gold/20 transition-colors flex items-center justify-center gap-2 border border-gold/10">
                      <Hammer size={16} /> Forjar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
        <ValidatorModal isOpen={isValidatorOpen} onClose={() => setIsValidatorOpen(false)} />
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen transition-all duration-700 pb-20 selection:bg-gold/30 ${activeStore.theme.glassmorphism ? 'backdrop-blur-sm' : ''}`} 
      style={{ 
        backgroundColor: 'var(--bg-color)', 
        color: 'white', 
        fontFamily: 'var(--store-font), sans-serif' 
      }}
    >
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 p-4 sm:p-6 transition-all">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('HUB')} className="p-2.5 text-stone-400 hover:text-white bg-white/5 rounded-xl border border-white/5 hover:border-gold/30 transition-all">
              <ArrowLeft size={20} />
            </button>
            <div className="hidden xs:block">
              <h1 className="text-xl md:text-2xl font-serif font-bold leading-tight" style={{ color: 'var(--primary-color)' }}>{activeStore.storeName}</h1>
              <span className="text-slate-500 text-[9px] uppercase tracking-[0.2em] font-bold">{activeStore.slug}.acdm.online</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {isAdmin && (
              <button onClick={() => setIsEditorOpen(true)} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold text-stone-300 hover:text-gold hover:border-gold/30 transition-all">
                <Hammer size={18} /> <span className="hidden md:inline">Forja do Mestre</span>
              </button>
            )}
            <button className="relative p-3 text-stone-200 bg-white/5 border border-white/10 rounded-xl hover:bg-gold/10 hover:text-gold transition-all" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={22} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg animate-bounce">{cart.reduce((a,b)=>a+b.quantity,0)}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6">
        {view === 'SHOP' && (
          <div className="animate-fade-in space-y-12 pt-8">
             {activeStore.theme.showBanner && activeStore.theme.bannerImage && (
               <div className="w-full h-[300px] md:h-[450px] relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
                 <img src={activeStore.theme.bannerImage} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                 <div className="absolute bottom-10 left-10 right-10 text-center md:text-left">
                   <h2 className="text-4xl md:text-7xl mb-4 font-serif font-black tracking-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>{activeStore.storeName}</h2>
                   <p className="text-stone-300 text-lg md:text-xl font-serif italic max-w-2xl">{activeStore.storeTagline}</p>
                 </div>
               </div>
             )}

             {!activeStore.theme.showBanner && (
               <div className="text-center py-12 md:py-20">
                 <h2 className="text-5xl md:text-8xl mb-4 font-serif font-black tracking-tighter" style={{ color: 'var(--primary-color)' }}>{activeStore.storeName}</h2>
                 <p className="text-stone-400 text-xl md:text-2xl font-serif italic">{activeStore.storeTagline}</p>
               </div>
             )}

             <div className={`
               grid gap-6 md:gap-10
               ${activeStore.theme.layoutType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''}
               ${activeStore.theme.layoutType === 'compact' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6' : ''}
               ${activeStore.theme.layoutType === 'list' ? 'grid-cols-1' : ''}
             `}>
               {activeStore.products.map(product => (
                 <ProductCard 
                   key={product.id} 
                   layout={activeStore.theme.layoutType}
                   product={product} 
                   onAddToCart={(p) => {
                    setCart(prev => {
                      const ex = prev.find(i => i.id === p.id);
                      if (ex) return prev.map(i => i.id === p.id ? {...i, quantity: i.quantity + 1} : i);
                      return [...prev, {...p, quantity: 1}];
                    });
                    setIsCartOpen(true);
                   }} 
                 />
               ))}
             </div>
          </div>
        )}

        {view === 'CHECKOUT' && (
          <div className="max-w-2xl mx-auto bg-stone-900/50 backdrop-blur-md border border-white/5 p-8 md:p-12 mt-12 rounded-[2rem] shadow-3xl" style={{ borderRadius: 'var(--border-radius)' }}>
            <h2 className="text-3xl text-gold mb-8 font-serif font-bold text-center" style={{ color: 'var(--primary-color)' }}>Ficha de Pagamento</h2>
            <form onSubmit={(e) => { e.preventDefault(); setView('INVOICE'); }} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Identificação do Aventureiro</label>
                <input required type="text" placeholder="Nome do Herói" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-lg text-white focus:border-gold outline-none transition-all" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Classe de Herói</label>
                  <select value={customer.characterClass} onChange={e => setCustomer({...customer, characterClass: e.target.value})} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-lg text-white outline-none focus:border-gold transition-all appearance-none cursor-pointer">
                    {CHARACTER_CLASSES.map(cls => <option key={cls} value={cls} className="bg-stone-900">{cls}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Ouro na Algibeira (PO)</label>
                  <input required type="number" placeholder="PO" value={userBudget || ''} onChange={e => setUserBudget(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-lg text-gold font-black outline-none focus:border-gold transition-all" />
                </div>
              </div>

              <div className="pt-8">
                <Button type="submit" className="w-full py-6 text-xl" disabled={!customer.name || userBudget < cart.reduce((a,b)=>a+(b.price*b.quantity),0)}>
                  Finalizar Transação
                </Button>
                {userBudget < cart.reduce((a,b)=>a+(b.price*b.quantity),0) && (
                  <p className="text-center text-red-500 mt-4 text-xs font-bold animate-pulse">Você não tem ouro suficiente para esta jornada.</p>
                )}
              </div>
            </form>
          </div>
        )}

        {view === 'INVOICE' && (
          <div className="mt-12">
            <Invoice items={cart} customer={customer} onBack={() => { setView('SHOP'); setCart([]); }} userBudget={userBudget} />
          </div>
        )}
      </main>

      {isEditorOpen && isAdmin && (
        <EditorPanel 
          config={activeStore} 
          onChange={updateActiveStore} 
          onClose={() => setIsEditorOpen(false)} 
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      <CartSidebar 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart}
        onRemove={(id) => setCart(cart.filter(i => i.id !== id))} 
        onUpdateQuantity={(id, delta) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))}
        onCheckout={() => { setIsCartOpen(false); setView('CHECKOUT'); }}
        userBudget={userBudget}
      />
      <ValidatorModal isOpen={isValidatorOpen} onClose={() => setIsValidatorOpen(false)} />
    </div>
  );
}

export default App;
