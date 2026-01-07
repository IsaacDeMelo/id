
import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { CartItem, CustomerDetails } from '../types';
import { FLAVOR_TEXTS } from '../constants';
import Button from './Button';
import { Download, Loader2, ArrowLeft } from 'lucide-react';

interface InvoiceProps {
  items: CartItem[];
  customer: CustomerDetails;
  onBack: () => void;
  userBudget: number;
}

const Invoice: React.FC<InvoiceProps> = ({ items, customer, onBack, userBudget }) => {
  const [loading, setLoading] = useState(true);
  const [flavorText, setFlavorText] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);

  const generateSecretToken = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const getRandomString = (len: number) => 
      Array(len).fill(0).map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
    
    let digits = [0, 0, 0, 0];
    while (true) {
      const d1 = Math.floor(Math.random() * 10);
      const d2 = Math.floor(Math.random() * 10);
      const d3 = Math.floor(Math.random() * 10);
      const d4 = 21 - (d1 + d2 + d3);
      if (d4 >= 0 && d4 <= 9) {
        digits = [d1, d2, d3, d4];
        break;
      }
    }
    return `RPG-${getRandomString(4)}-${getRandomString(4)}-${digits.join('')}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setFlavorText(FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)]);
      setReceiptId(generateSecretToken());
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current, {
        backgroundColor: null, 
        scale: 2 
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Recibo_${customer.name.replace(/\s+/g, '_')}.png`;
      link.click();
    }
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const change = userBudget - total;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 size={48} className="animate-spin mb-4 text-gold" />
        <p className="font-serif text-xl animate-pulse">O escriba está autenticando o pergaminho...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-10 px-4">
      <div className="flex justify-between mb-6">
        <Button variant="secondary" size="sm" onClick={onBack}><ArrowLeft size={14} /> Nova Compra</Button>
        <Button size="sm" onClick={handleDownload}><Download size={14} /> Salvar PNG</Button>
      </div>

      <div 
        ref={invoiceRef}
        className="p-10 shadow-2xl relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--parchment-color)', 
          color: 'var(--ink-color)',
          fontFamily: "'Cinzel', serif"
        }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

        <div className="border-4 border-double border-current p-8 relative z-10">
          <div className="text-center border-b border-current pb-6 mb-6">
            <h1 className="text-3xl font-black uppercase mb-1">Recibo Imperial</h1>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase">Autenticado pelo Sindicato dos Dragões</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 font-sans">
            <div><span className="text-[9px] uppercase opacity-60">Portador:</span><br/><span className="font-bold">{customer.name}</span></div>
            <div className="text-right"><span className="text-[9px] uppercase opacity-60">Classe:</span><br/><span className="font-bold">{customer.characterClass}</span></div>
          </div>

          <table className="w-full mb-8 font-sans text-xs">
            <thead className="border-b border-current">
              <tr className="text-left font-black uppercase text-[10px]">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Qtd</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-black/5">
                  <td className="py-2 font-bold font-serif">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">{item.price * item.quantity} PO</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col items-end gap-1 mb-10 border-t border-current pt-4">
            <div className="flex justify-between w-48 text-[10px] uppercase"><span>Total:</span><span>{total} PO</span></div>
            <div className="flex justify-between w-48 text-[10px] uppercase"><span>Pago:</span><span>{userBudget} PO</span></div>
            <div className="flex justify-between w-48 text-xl font-black border-t border-current pt-2"><span>Troco:</span><span>{change} PO</span></div>
          </div>

          <div className="flex justify-between items-end">
            <div className="max-w-xs text-[10px] italic">"{flavorText}"</div>
            <div className="text-center border border-current p-2 rotate-2 bg-white/10">
              <span className="block text-[8px] uppercase font-bold">Token Rúnico</span>
              <span className="font-mono text-xs font-black">{receiptId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
