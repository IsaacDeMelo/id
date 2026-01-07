
import React from 'react';
import { StoreConfig, Product } from '../types';
import { X, Save, Plus, Trash2, Palette, Settings, Package, Database, Globe, CloudLightning } from 'lucide-react';
import Button from './Button';

interface EditorPanelProps {
  config: StoreConfig;
  onChange: (config: StoreConfig) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ config, onChange, onClose, onSave, isSaving }) => {
  const [activeTab, setActiveTab] = React.useState<'general' | 'theme' | 'items' | 'publish'>('publish');

  const updateTheme = (updates: Partial<typeof config.theme>) => {
    onChange({ ...config, theme: { ...config.theme, ...updates } });
  };

  const addItem = () => {
    const newItem: Product = {
      id: Date.now().toString(),
      name: 'Novo Item',
      description: '...',
      price: 10,
      category: 'misc',
      image: 'https://picsum.photos/id/1015/400/300'
    };
    onChange({ ...config, products: [newItem, ...config.products] });
  };

  const updateItem = (id: string, updates: Partial<Product>) => {
    onChange({
      ...config,
      products: config.products.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-stone-900 border-l border-stone-700 shadow-2xl z-50 flex flex-col animate-slide-in">
      <div className="p-4 border-b border-stone-700 flex justify-between items-center bg-stone-800">
        <h2 className="font-serif text-gold flex items-center gap-2">
          <Settings size={18} />
          Painel de Controle
        </h2>
        <button onClick={onClose} className="text-stone-400 hover:text-white"><X size={20} /></button>
      </div>

      <div className="flex bg-stone-950 border-b border-stone-800">
        <button onClick={() => setActiveTab('general')} className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${activeTab === 'general' ? 'text-gold bg-stone-900 border-b-2 border-gold' : 'text-stone-500'}`}>Geral</button>
        <button onClick={() => setActiveTab('theme')} className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${activeTab === 'theme' ? 'text-gold bg-stone-900 border-b-2 border-gold' : 'text-stone-500'}`}>Estilo</button>
        <button onClick={() => setActiveTab('items')} className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${activeTab === 'items' ? 'text-gold bg-stone-900 border-b-2 border-gold' : 'text-stone-500'}`}>Itens</button>
        <button onClick={() => setActiveTab('publish')} className={`flex-1 py-3 text-[10px] uppercase tracking-widest ${activeTab === 'publish' ? 'text-gold bg-stone-900 border-b-2 border-gold' : 'text-stone-500'}`}>Link</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase text-stone-500 mb-1">Título da Loja</label>
              <input value={config.storeName} onChange={e => onChange({...config, storeName: e.target.value})} className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-stone-500 mb-1">Slogan</label>
              <textarea value={config.storeTagline} onChange={e => onChange({...config, storeTagline: e.target.value})} className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-sm text-white h-20" />
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-4">
             <div>
              <label className="block text-[10px] uppercase text-stone-500 mb-1">Cor Primária</label>
              <input type="color" value={config.theme.primaryColor} onChange={e => updateTheme({primaryColor: e.target.value})} className="w-full h-10 bg-transparent cursor-pointer" />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-stone-500 mb-1">Fonte Principal</label>
              <select value={config.theme.fontFamily} onChange={e => updateTheme({fontFamily: e.target.value as any})} className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-sm text-white">
                <option value="Cinzel">Cinzel</option>
                <option value="Lato">Lato</option>
                <option value="Serif">Serif</option>
                <option value="Monospace">Mono</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-4">
            <Button size="sm" className="w-full" onClick={addItem}><Plus size={16} /> Novo Item</Button>
            {config.products.map(p => (
              <div key={p.id} className="bg-stone-950 border border-stone-800 p-3 rounded">
                <div className="flex justify-between mb-2">
                  <input className="bg-transparent border-none text-gold font-bold text-sm" value={p.name} onChange={e => updateItem(p.id, {name: e.target.value})} />
                  <button onClick={() => onChange({...config, products: config.products.filter(i => i.id !== p.id)})} className="text-red-500"><Trash2 size={14} /></button>
                </div>
                <input type="number" className="w-full bg-stone-900 border-none text-xs p-1 mb-1 text-white" value={p.price} onChange={e => updateItem(p.id, {price: Number(e.target.value)})} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase text-stone-500 mb-1">Slug do Domínio (Editável)</label>
              <div className="flex items-center gap-1 bg-stone-950 border border-stone-700 rounded p-2 text-xs">
                <input 
                  value={config.slug} 
                  onChange={e => onChange({...config, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                  className="bg-transparent border-none text-gold font-bold w-full focus:outline-none"
                />
                <span className="text-stone-600">.acdm.online</span>
              </div>
              <p className="text-[9px] text-stone-500 mt-2 uppercase tracking-tighter">Este slug define o seu link exclusivo.</p>
            </div>
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded">
               <div className="flex items-center gap-2 text-blue-400 mb-1 font-bold text-xs uppercase">
                 <Database size={12} /> Sync OnRender
               </div>
               <p className="text-[10px] text-slate-500">Ao salvar, a nova URL será ativada instantaneamente via parâmetros.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-700 bg-stone-800">
        <Button className="w-full shadow-lg shadow-gold/10" onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <div className="flex items-center gap-2">
              <CloudLightning className="animate-pulse" size={16} />
              Salvando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save size={18} />
              Publicar Alterações
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditorPanel;
