import React, { useEffect, useState, useRef } from 'react';
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

  // Fictitious store owner name
  const STORE_OWNER_NAME = "Mestre Alaric, o Dourado";

  // Token Generation Logic (Sum = 21)
  const generateSecretToken = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const getRandomString = (len: number) => 
      Array(len).fill(0).map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
    
    // Generate valid numbers
    let digits = [0, 0, 0, 0];
    while (true) {
      const d1 = Math.floor(Math.random() * 10);
      const d2 = Math.floor(Math.random() * 10);
      const d3 = Math.floor(Math.random() * 10);
      
      // Calculate needed 4th digit
      const tempSum = d1 + d2 + d3;
      const d4 = 21 - tempSum;

      if (d4 >= 0 && d4 <= 9) {
        digits = [d1, d2, d3, d4];
        break; // Valid combination found
      }
    }

    return `RPG-${getRandomString(4)}-${getRandomString(4)}-${digits.join('')}`;
  };

  useEffect(() => {
    // Simulate Scribe working
    const timer = setTimeout(() => {
      setLoading(false);
      const randomText = FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)];
      setFlavorText(randomText);
      setReceiptId(generateSecretToken());
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current, {
        backgroundColor: '#f5e6c8', 
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
  const date = new Date().toLocaleDateString('pt-BR');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-gold">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-serif text-xl animate-pulse">O escriba imperial está autenticando seu pergaminho...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar à Loja
        </Button>
        <Button onClick={handleDownload}>
          <Download size={16} /> Baixar Recibo (PNG)
        </Button>
      </div>

      {/* INVOICE AREA */}
      <div 
        ref={invoiceRef}
        className="bg-parchment text-ink p-8 md:p-16 shadow-2xl rounded-sm min-h-[1050px] flex flex-col w-full mx-auto relative overflow-hidden"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {/* Paper texture overlay simulation */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

        <div className="border-4 border-double border-ink/30 p-8 md:p-12 flex-1 flex flex-col relative z-10">
          
          {/* Header */}
          <div className="text-center border-b-2 border-ink pb-8 mb-8">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-ink">O Empório do Dragão Dourado</h1>
            <p className="font-sans text-xs font-bold opacity-70 tracking-[0.3em] text-ink uppercase">Fornecedor Oficial do Reino</p>
            <div className="mt-6 text-[10px] font-sans flex justify-between px-2 opacity-60 text-ink">
              <span>SOL DE VERÃO, ANO 1422</span>
              <span>VALE DAS SOMBRAS, QG</span>
              <span>DATA: {date}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-10 font-sans text-ink">
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Portador</span>
                <span className="text-xl font-bold font-serif">{customer.name}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Vocação</span>
                <span className="text-xl font-bold font-serif">{customer.characterClass}</span>
              </div>
              {customer.guild && (
                 <div className="col-span-2 pt-2">
                    <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Aliança / Guilda</span>
                    <span className="font-bold text-lg">{customer.guild}</span>
                 </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-grow">
            <table className="w-full mb-10 font-sans text-sm text-ink">
              <thead>
                <tr className="border-b-2 border-ink/40 text-left">
                  <th className="py-3 w-1/2 uppercase tracking-wider text-xs">Artefato</th>
                  <th className="py-3 text-center uppercase tracking-wider text-xs">Qtd</th>
                  <th className="py-3 text-right uppercase tracking-wider text-xs">Unit.</th>
                  <th className="py-3 text-right uppercase tracking-wider text-xs">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-ink/10">
                    <td className="py-3 font-bold font-serif">{item.name}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">{item.price} PO</td>
                    <td className="py-3 text-right font-bold">{item.price * item.quantity} PO</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="border-t-2 border-ink pt-6 mb-12 flex flex-col items-end gap-2">
            <div className="flex justify-between w-full md:w-64 text-sm font-sans opacity-70">
              <span>OURO ENTREGUE:</span>
              <span className="font-bold">{userBudget} PO</span>
            </div>
            <div className="flex justify-between w-full md:w-64 text-sm font-sans opacity-70">
              <span>SUBTOTAL:</span>
              <span className="font-bold">-{total} PO</span>
            </div>
            <div className="flex justify-between w-full md:w-64 border-t border-ink/20 pt-2 text-xl font-serif font-black">
              <span>TROCO:</span>
              <span>{change} PO</span>
            </div>
          </div>

          {/* Footer / Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-ink/20">
            <div className="text-center md:text-left">
              <p className="italic font-sans text-xs opacity-70 mb-8 leading-relaxed">"{flavorText}"</p>
              
              <div className="inline-block border border-ink p-3 rotate-[-1deg] bg-parchment shadow-sm">
                <span className="block text-[8px] uppercase tracking-[0.2em] opacity-50 mb-1">Selo de Autenticidade</span>
                <span className="font-mono text-sm tracking-widest font-bold">{receiptId}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-end">
              <div className="w-full max-w-[200px] text-center">
                <div className="font-handwriting text-3xl text-ink mb-1 select-none pointer-events-none h-10 flex items-center justify-center">
                  {STORE_OWNER_NAME}
                </div>
                <div className="border-t border-ink/40 w-full pt-1">
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Assinatura do Mercador</span>
                </div>
              </div>
              <div className="mt-6 opacity-30 grayscale contrast-125">
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=O_Dragao_Agradece" alt="Selo Real" className="w-12 h-12 mix-blend-multiply" />
              </div>
            </div>
          </div>

        </div>
      </div>
      <p className="text-center text-stone-500 text-[10px] uppercase tracking-widest mt-6 opacity-50">
        Este pergaminho é um documento fiscal mágico. Falsificação punível com petrificação.
      </p>
    </div>
  );
};

export default Invoice;