
import { useState, FC } from 'react';
import { StoreConfig, Product, LayoutType } from '../types';
import { X, Save, Plus, Trash2, Settings, Database, CloudLightning, Image as ImageIcon, Layout, Palette, ShoppingBag, Sparkles } from 'lucide-react';
import Button from './Button';

interface EditorPanelProps {
  config: StoreConfig;
  onChange: (config: StoreConfig) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const EditorPanel: FC<EditorPanelProps> = ({ config, onChange, onClose, onSave, isSaving }) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'style' | 'items' | 'advanced'>('identity');

  const updateTheme = (updates: Partial<typeof config.theme>) => {
    onChange({ ...config, theme: { ...config.theme, ...updates } });
  };

  const addItem = () => {
    const newItem: Product = {
      id: Date.now().toString(),
      name: 'Novo Item Arcano',
      description: 'Descreva os poderes deste item...',
      price: 50,
      category: 'misc',
      image: 'https://images.unsplash.com/photo-1514467958571-337553f19114?auto=format&fit=crop&q=80&w=400',
      rarity: 'common'
    };
    onChange({ ...config, products: [newItem, ...config.products] });
  };

  const updateItem = (id: string, updates: Partial<Product>) => {
    onChange({
      ...config,
      products: config.products.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const removeItem = (id: string) => {
    onChange({ ...config, products: config.products.filter(p => p.id !== id) });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-stone-900 border-l border-stone-700 shadow-2xl z-50 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-stone-700 flex justify-between items-center bg-stone-800">
        <h2 className="font-serif text-gold flex items-center gap-2 text-lg">
          <Settings size={20} />
          Forja do Mestre
        </h2>
        <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex bg-stone-950 border-b border-stone-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'identity', icon: <ImageIcon size={14}/>, label: 'Identidade' },
          { id: 'style', icon: <Palette size={14}/>, label: 'Estética' },
          { id: 'items', icon: <ShoppingBag size={14}/>, label: 'Estoque' },
          { id: 'advanced', icon: <Database size={14}/>, label: 'Deploy' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex-1 py-4 px-2 text-[10px] uppercase tracking-widest font-bold flex flex-col items-center gap-1 transition-all
              ${activeTab === tab.id ? 'text-gold bg-stone-900 border-b-2 border-gold' : 'text-stone-500 hover:text-stone-300'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        
        {activeTab === 'identity' && (
          <div className="space-y-6 animate-fade-in">
            <section className="space-y-4">
              <h3 className="text-stone-400 text-[10px] font-bold uppercase tracking-widest border-b border-stone-800 pb-2">Informações Básicas</h3>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Nome do Domínio</label>
                <input value={config.storeName} onChange={e => onChange({...config, storeName: e.target.value})} className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Slogan do Reino</label>
                <input value={config.storeTagline} onChange={e => onChange({...config, storeTagline: e.target.value})} className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-gold outline-none" />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-stone-400 text-[10px] font-bold uppercase tracking-widest border-b border-stone-800 pb-2">Imagens de Cabeçalho</h3>
              <div>
                <label className="block text-xs text-stone-500 mb-1">URL do Banner</label>
                <input value={config.theme.bannerImage} onChange={e => updateTheme({bannerImage: e.target.value})} className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs text-stone-300 mb-2 font-mono" />
                {config.theme.bannerImage && <img src={config.theme.bannerImage} className="w-full h-20 object-cover rounded-lg border border-stone-800" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Exibir Banner na Loja</span>
                <input type="checkbox" checked={config.theme.showBanner} onChange={e => updateTheme({showBanner: e.target.checked})} className="accent-gold w-4 h-4" />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-6 animate-fade-in">
            <section className="space-y-4">
              <h3 className="text-stone-400 text-[10px] font-bold uppercase tracking-widest border-b border-stone-800 pb-2">Layout e Grid</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['grid', 'list', 'compact'] as LayoutType[]).map(type => (
                  <button 
                    key={type}
                    onClick={() => updateTheme({layoutType: type})}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all
                      ${config.theme.layoutType === type ? 'border-gold bg-gold/10 text-gold' : 'border-stone-800 bg-stone-950 text-stone-500'}`}
                  >
                    <Layout size={18} />
                    <span className="text-[10px] uppercase font-bold">{type}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-stone-400 text-[10px] font-bold uppercase tracking-widest border-b border-stone-800 pb-2">Paleta Alquímica</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1 uppercase">Destaque (Gold)</label>
                  <input type="color" value={config.theme.primaryColor} onChange={e => updateTheme({primaryColor: e.target.value})} className="w-full h-10 bg-transparent cursor-pointer rounded overflow-hidden" />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1 uppercase">Fundo</label>
                  <input type="color" value={config.theme.backgroundColor} onChange={e => updateTheme({backgroundColor: e.target.value})} className="w-full h-10 bg-transparent cursor-pointer rounded overflow-hidden" />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1 uppercase">Cartões</label>
                  <input type="color" value={config.theme.cardColor} onChange={e => updateTheme({cardColor: e.target.value})} className="w-full h-10 bg-transparent cursor-pointer rounded overflow-hidden" />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1 uppercase">Bordas</label>
                  <input type="text" value={config.theme.borderRadius} onChange={e => updateTheme({borderRadius: e.target.value})} placeholder="12px" className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-xs text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-950 rounded-lg border border-stone-800">
                <div className="flex items-center gap-2 text-gold">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold">Efeito Glassmorphism</span>
                </div>
                <input type="checkbox" checked={config.theme.glassmorphism} onChange={e => updateTheme({glassmorphism: e.target.checked})} className="accent-gold w-4 h-4" />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-4 animate-fade-in">
            <Button size="sm" className="w-full mb-4 py-3" onClick={addItem}>
              <Plus size={16} /> Encantar Novo Item
            </Button>
            
            <div className="space-y-3">
              {config.products.map(p => (
                <div key={p.id} className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
                  <div className="p-3 bg-stone-900/50 flex items-center justify-between border-b border-stone-800">
                    <input 
                      className="bg-transparent border-none text-gold font-bold text-sm focus:outline-none w-2/3" 
                      value={p.name} 
                      onChange={e => updateItem(p.id, {name: e.target.value})} 
                    />
                    <button onClick={() => removeItem(p.id)} className="text-red-500/50 hover:text-red-500 p-1 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                       <div className="flex-1">
                          <label className="text-[9px] uppercase text-stone-600">Preço (PO)</label>
                          <input type="number" className="w-full bg-stone-900 rounded p-2 text-xs text-white" value={p.price} onChange={e => updateItem(p.id, {price: Number(e.target.value)})} />
                       </div>
                       <div className="flex-1">
                          <label className="text-[9px] uppercase text-stone-600">Raridade</label>
                          <select className="w-full bg-stone-900 rounded p-2 text-xs text-white uppercase" value={p.rarity} onChange={e => updateItem(p.id, {rarity: e.target.value as any})}>
                            <option value="common">Comum</option>
                            <option value="uncommon">Incomum</option>
                            <option value="rare">Raro</option>
                            <option value="epic">Épico</option>
                            <option value="legendary">Lendário</option>
                          </select>
                       </div>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-stone-600">URL da Imagem</label>
                      <input className="w-full bg-stone-900 rounded p-2 text-[10px] text-stone-400 font-mono" value={p.image} onChange={e => updateItem(p.id, {image: e.target.value})} />
                    </div>
                    <textarea className="w-full bg-stone-900 rounded p-2 text-xs text-stone-300 h-16 resize-none" value={p.description} onChange={e => updateItem(p.id, {description: e.target.value})} placeholder="Descrição do item..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6 animate-fade-in">
            <section className="space-y-4">
              <h3 className="text-stone-400 text-[10px] font-bold uppercase tracking-widest border-b border-stone-800 pb-2">Subdomínio</h3>
              <div className="flex items-center gap-1 bg-stone-950 border border-stone-700 rounded-lg p-4 text-sm">
                <input 
                  value={config.slug} 
                  onChange={e => onChange({...config, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                  className="bg-transparent border-none text-gold font-bold w-full focus:outline-none"
                />
                <span className="text-stone-600 font-mono">.acdm.online</span>
              </div>
            </section>
            
            <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl space-y-2">
               <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase">
                 <CloudLightning size={14} /> Persistência Global
               </div>
               <p className="text-[10px] text-stone-500 leading-relaxed">
                 Ao salvar, estas configurações serão gravadas no **MongoDB Cluster0**. 
                 Qualquer usuário acessando seu link verá as alterações instantaneamente.
               </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Save */}
      <div className="p-6 border-t border-stone-700 bg-stone-800/80 backdrop-blur-md">
        <Button className="w-full shadow-2xl py-4 group" onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <div className="flex items-center gap-2">
              <CloudLightning className="animate-pulse" size={18} />
              Canalizando Dados...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save size={20} className="group-hover:scale-110 transition-transform" />
              Forjar Alterações
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditorPanel;
