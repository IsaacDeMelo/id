
import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Hammer, Plus, ArrowLeft, Trash2, ExternalLink, Globe, Copy, CheckCircle2, CloudLightning, ShieldCheck } from 'lucide-react';
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
    const res = await fetch(`${API_URL}/stores`);
    if (!res.ok) return [{ ...DEFAULT_CONFIG, id: 'default' }];
    return res.json();
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
      storeName: 'Nova Loja RPG',
    };
    setIsSaving(true);
    const saved = await StoreService.saveStore(newStore);
    setStores([...stores, saved]);
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
      alert("Erro ao salvar no MongoDB");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteStore = async (id: string) => {
    if (!confirm("Deseja apagar este domínio permanentemente?")) return;
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-gold gap-4">
      <CloudLightning className="animate-pulse text-gold" size={48} />
      <span className="font-serif tracking-widest animate-pulse">Conectando ao MongoDB Cluster0...</span>
    </div>
  );

  if (view === 'HUB') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
        <nav className="border-b border-slate-800 bg-slate-900/50 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-slate-950 font-serif font-black">S</div>
            <span className="font-serif text-xl tracking-tight text-white">ScribeForge SaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsValidatorOpen(true)}
              className="text-slate-500 hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <ShieldCheck size={16} /> Verificar Recibo
            </button>
            <div className="h-4 w-[1px] bg-slate-800"></div>
            {isAdmin ? (
              <span className="text-[10px] text-green-400 font-bold uppercase border border-green-500/20 px-2 py-1 rounded">DB Online</span>
            ) : (
              <a href="?role=adm" className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest border border-slate-800 px-3 py-1 rounded">Admin</a>
            )}
          </div>
        </nav>

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">Domínios Ativos</h2>
              <p className="text-slate-500 text-sm">Gerencie suas instâncias no Cluster0</p>
            </div>
            {isAdmin && (
              <button onClick={createNewStore} disabled={isSaving} className="bg-gold text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50">
                <Plus size={18} /> Novo Domínio
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => (
              <div key={store.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-gold/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center text-gold">
                    <Globe size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => deleteStore(store.id)} className="p-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{store.storeName}</h3>
                <div className="flex items-center gap-2 text-gold text-xs font-mono mb-6">
                   {store.slug}.acdm.online
                   <button onClick={() => copyToClipboard(store.slug)} className="text-slate-600 hover:text-white">
                      {copiedSlug === store.slug ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                   </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setActiveStoreId(store.id); setView('SHOP'); }} className="flex-1 bg-slate-800 py-2 rounded-lg text-white font-bold text-xs hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                    <ExternalLink size={14} /> Abrir
                  </button>
                  {isAdmin && (
                    <button onClick={() => { setActiveStoreId(store.id); setIsEditorOpen(true); }} className="flex-1 bg-gold/10 py-2 rounded-lg text-gold font-bold text-xs hover:bg-gold/20 transition-colors flex items-center justify-center gap-2">
                      <Hammer size={14} /> Editar
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
    <div className="min-h-screen transition-colors duration-500 pb-20" style={{ backgroundColor: 'var(--bg-color)', color: 'white', fontFamily: 'var(--store-font), sans-serif' }}>
      <header className="sticky top-0 z-30 bg-stone-950/80 backdrop-blur-md border-b border-stone-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('HUB')} className="p-2 text-stone-500 hover:text-white bg-stone-900 rounded-lg border border-stone-800">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold leading-none" style={{ color: 'var(--primary-color)' }}>{activeStore.storeName}</h1>
              <span className="text-slate-500 text-[9px] uppercase tracking-widest">{activeStore.slug}.acdm.online</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button onClick={() => setIsEditorOpen(true)} className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-2 rounded-lg text-xs font-bold text-stone-400 hover:text-gold transition-colors">
                <Hammer size={16} /> Customizar
              </button>
            )}
            <button className="relative p-2 text-stone-200 bg-stone-900 border border-stone-800 rounded-lg" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cart.reduce((a,b)=>a+b.quantity,0)}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-12">
        {view === 'SHOP' && (
          <div className="animate-fade-in">
             <div className="mb-12 text-center">
               <h2 className="text-4xl md:text-6xl mb-4 font-serif">{activeStore.storeName}</h2>
               <p className="text-stone-400 max-w-lg mx-auto italic">{activeStore.storeTagline}</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {activeStore.products.map(product => (
                 <ProductCard key={product.id} product={product} onAddToCart={(p) => {
                    setCart(prev => {
                      const ex = prev.find(i => i.id === p.id);
                      if (ex) return prev.map(i => i.id === p.id ? {...i, quantity: i.quantity + 1} : i);
                      return [...prev, {...p, quantity: 1}];
                    });
                    setIsCartOpen(true);
                 }} />
               ))}
             </div>
          </div>
        )}

        {view === 'CHECKOUT' && (
          <div className="max-w-lg mx-auto bg-stone-900 border border-stone-800 p-8 rounded-lg shadow-2xl" style={{ borderRadius: 'var(--border-radius)' }}>
            <h2 className="text-2xl text-gold mb-6 font-serif" style={{ color: 'var(--primary-color)' }}>Dados do Aventureiro</h2>
            <form onSubmit={(e) => { e.preventDefault(); setView('INVOICE'); }} className="space-y-6">
              <input required type="text" placeholder="Nome Completo" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-stone-950 border border-stone-800 p-3 rounded" style={{ borderRadius: 'var(--border-radius)' }} />
              <div className="grid grid-cols-2 gap-4">
                <select value={customer.characterClass} onChange={e => setCustomer({...customer, characterClass: e.target.value})} className="bg-stone-950 border border-stone-800 p-3 rounded" style={{ borderRadius: 'var(--border-radius)' }}>
                  {CHARACTER_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
                <input required type="number" placeholder="PO na Bolsa" value={userBudget || ''} onChange={e => setUserBudget(Number(e.target.value))} className="bg-stone-950 border border-stone-800 p-3 rounded text-gold font-bold" style={{ borderRadius: 'var(--border-radius)' }} />
              </div>
              <Button type="submit" className="w-full py-4" disabled={!customer.name || userBudget < cart.reduce((a,b)=>a+(b.price*b.quantity),0)}>Finalizar Compra</Button>
            </form>
          </div>
        )}

        {view === 'INVOICE' && (
          <Invoice items={cart} customer={customer} onBack={() => { setView('SHOP'); setCart([]); }} userBudget={userBudget} />
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
