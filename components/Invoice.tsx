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

  // Fictitious luxurious store owner name
  const STORE_OWNER_NAME = "Magnânimo Arquiduque B. Saey";

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
    <div className="max-w-3xl mx-auto animate-fade-in pb-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Button variant="secondary" size="sm" onClick={onBack}>
          <ArrowLeft size={14} /> Voltar à Loja
        </Button>
        <Button size="sm" onClick={handleDownload}>
          <Download size={14} /> Baixar Recibo (PNG)
        </Button>
      </div>

      {/* INVOICE AREA - More compact and refined */}
      <div 
        ref={invoiceRef}
        className="bg-parchment text-ink p-6 md:p-10 shadow-2xl rounded-sm flex flex-col w-full mx-auto relative overflow-hidden"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {/* Paper texture overlay simulation */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

        <div className="border-2 border-double border-ink/40 p-6 md:p-8 flex-1 flex flex-col relative z-10">
          
          {/* Header */}
          <div className="text-center border-b border-ink/60 pb-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-1 text-ink">O Empório do Dragão Dourado</h1>
            <p className="font-sans text-[9px] font-bold opacity-70 tracking-[0.3em] text-ink uppercase">Fornecedor Oficial do Reino</p>
            <div className="mt-4 text-[9px] font-sans flex justify-between px-2 opacity-60 text-ink italic">
              <span>SOL DE VERÃO, ANO 1422</span>
              <span>VALE DAS SOMBRAS, QG</span>
              <span>DATA: {date}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8 font-sans text-ink">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <span className="block text-[9px] uppercase tracking-[0.15em] opacity-60 mb-0.5">Portador</span>
                <span className="text-base font-bold font-serif">{customer.name}</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] uppercase tracking-[0.15em] opacity-60 mb-0.5">Vocação</span>
                <span className="text-base font-bold font-serif">{customer.characterClass}</span>
              </div>
              {customer.guild && (
                 <div className="col-span-2 pt-2 border-t border-ink/5">
                    <span className="block text-[9px] uppercase tracking-[0.15em] opacity-60 mb-0.5">Guilda</span>
                    <span className="font-bold text-sm">{customer.guild}</span>
                 </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-grow">
            <table className="w-full mb-8 font-sans text-xs text-ink">
              <thead>
                <tr className="border-b border-ink/40 text-left">
                  <th className="py-2 w-1/2 uppercase tracking-widest text-[10px] font-black">Item</th>
                  <th className="py-2 text-center uppercase tracking-widest text-[10px] font-black">Qtd</th>
                  <th className="py-2 text-right uppercase tracking-widest text-[10px] font-black">Unit.</th>
                  <th className="py-2 text-right uppercase tracking-widest text-[10px] font-black">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-ink/5">
                    <td className="py-2 font-bold font-serif text-sm">{item.name}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">{item.price} PO</td>
                    <td className="py-2 text-right font-bold">{item.price * item.quantity} PO</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="border-t border-ink/40 pt-4 mb-8 flex flex-col items-end gap-1">
            <div className="flex justify-between w-full md:w-56 text-[10px] font-sans opacity-70">
              <span>ENTREGUE:</span>
              <span className="font-bold">{userBudget} PO</span>
            </div>
            <div className="flex justify-between w-full md:w-56 text-[10px] font-sans opacity-70">
              <span>SUBTOTAL:</span>
              <span className="font-bold">-{total} PO</span>
            </div>
            <div className="flex justify-between w-full md:w-56 border-t border-ink/20 pt-2 mt-1 text-lg font-serif font-black">
              <span>TROCO:</span>
              <span className="text-ink">{change} PO</span>
            </div>
          </div>

          {/* Footer / Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-ink/20">
            <div className="text-center md:text-left">
              <p className="italic font-sans text-[10px] opacity-70 mb-6 leading-tight max-w-[240px]">"{flavorText}"</p>
              
              <div className="inline-block border border-ink/60 p-2 rotate-[-0.5deg] bg-parchment/50">
                <span className="block text-[7px] uppercase tracking-widest opacity-60 mb-0.5 font-bold">Autenticação Rúnica</span>
                <span className="font-mono text-[10px] tracking-widest font-black">{receiptId}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-end">
              <div className="w-full max-w-[200px] text-center relative">
                {/* Signature - "Saey" close to line and smaller */}
                <div 
                  className="font-signature quill-ink text-6xl text-ink mb-0 select-none pointer-events-none h-12 flex items-center justify-center"
                  style={{ 
                    transform: 'translateY(12px) rotate(-3deg)',
                    filter: 'contrast(1.1) brightness(0.8)'
                  }}
                >
                  Saey
                </div>
                
                {/* Signing Line */}
                <div className="border-t border-ink/60 w-full pt-1.5 mt-1">
                  <span className="text-[8px] uppercase tracking-widest opacity-80 block font-sans font-black leading-none">Pena Real</span>
                  <span className="text-[7px] opacity-60 italic block font-sans tracking-tight mt-0.5">{STORE_OWNER_NAME}</span>
                </div>
              </div>

              {/* Seal with Double Border Stamp style */}
              <div className="mt-6 relative flex items-center justify-center">
                 {/* Double border stamp effect */}
                 <div className="absolute w-16 h-16 border border-red-900/10 rounded-full rotate-45 opacity-30"></div>
                 <div className="absolute w-14 h-14 border-2 border-red-900/20 rounded-full -rotate-12 opacity-40 border-double"></div>
                 
                 {/* QR Stamp */}
                 <div className="w-10 h-10 relative grayscale contrast-[2] mix-blend-multiply opacity-40 hover:opacity-70 transition-opacity">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${receiptId}&color=450a0a`} 
                      alt="Stamp" 
                      className="w-full h-full p-1.5" 
                    />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-50 pointer-events-none"></div>
                 </div>
                 
                 <span className="absolute -bottom-2.5 text-[7px] font-sans font-black text-red-900/40 uppercase tracking-[0.2em] rotate-[-5deg] pointer-events-none">
                    VALIDADO
                 </span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <p className="text-center text-stone-500 text-[9px] uppercase tracking-[0.2em] mt-6 opacity-40 font-bold max-w-md mx-auto leading-relaxed">
        Pergaminho fiscal mágico. Falsificação sujeita a petrificação pelo Conselho do Império.
      </p>
    </div>
  );
};

export default Invoice;