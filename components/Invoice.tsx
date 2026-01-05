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
}

const Invoice: React.FC<InvoiceProps> = ({ items, customer, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [flavorText, setFlavorText] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);

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
      // If invalid (d4 < 0 or d4 > 9), loop runs again
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
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current, {
        backgroundColor: null, 
        scale: 2 // Higher resolution
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Recibo_${customer.name.replace(/\s+/g, '_')}_${receiptId}.png`;
      link.click();
    }
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const date = new Date().toLocaleDateString('pt-BR');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-gold">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-serif text-xl animate-pulse">O escriba está redigindo o pergaminho...</p>
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
          <Download size={16} /> Baixar Nota (PNG)
        </Button>
      </div>

      {/* INVOICE AREA - This part gets printed */}
      <div 
        ref={invoiceRef}
        // Changed: Removed relative/overflow-hidden restrictions that might clip content
        // Added flex flex-col and min-h to ensure it behaves like a paper sheet
        className="bg-parchment text-ink p-6 md:p-12 shadow-2xl rounded-sm min-h-[1000px] flex flex-col w-full mx-auto"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {/* Border Container: Uses flex-1 to fill parent, but allows growth */}
        <div className="border-4 border-double border-ink/40 p-6 md:p-10 flex-1 flex flex-col relative bg-parchment">
          
          {/* Header */}
          <div className="text-center border-b-2 border-ink pb-6 mb-6">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-2 text-ink">O Empório do Dragão Dourado</h1>
            <p className="font-sans text-sm font-bold opacity-80 text-ink">Artefatos Mágicos, Armas & Suprimentos Gerais</p>
            <div className="mt-4 text-xs font-sans flex justify-between px-4 md:px-10 opacity-70 text-ink">
              <span>Data: {date}</span>
              <span>Local: Vale das Sombras, 42</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8 font-sans text-ink">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs uppercase tracking-wide opacity-60">Cliente</span>
                <span className="text-lg font-bold">{customer.name}</span>
              </div>
              <div className="text-right">
                <span className="block text-xs uppercase tracking-wide opacity-60">Classe</span>
                <span className="text-lg font-bold">{customer.characterClass}</span>
              </div>
              {customer.guild && (
                 <div className="col-span-2">
                    <span className="block text-xs uppercase tracking-wide opacity-60">Guilda</span>
                    <span className="font-bold">{customer.guild}</span>
                 </div>
              )}
            </div>
          </div>

          {/* Table Container - Ensure it takes space */}
          <div className="flex-grow">
            <table className="w-full mb-8 font-sans text-sm text-ink">
              <thead>
                <tr className="border-b border-ink/30 text-left">
                  <th className="py-2 w-1/2">Item</th>
                  <th className="py-2 text-center">Qtd</th>
                  <th className="py-2 text-right">Preço Un.</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <tr key={idx} className="border-b border-ink/10">
                      <td className="py-2 font-bold font-serif text-ink">{item.name}</td>
                      <td className="py-2 text-center text-ink">{item.quantity}</td>
                      <td className="py-2 text-right text-ink">{item.price} PO</td>
                      <td className="py-2 text-right font-bold text-ink">{item.price * item.quantity} PO</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-ink italic opacity-70">
                      Nenhum item adquirido. (Como você chegou aqui?)
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="text-lg border-t border-ink/30">
                  <td colSpan={3} className="pt-4 text-right font-serif font-black text-ink">TOTAL A PAGAR:</td>
                  <td className="pt-4 text-right font-black font-serif text-ink">{total} PO</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer / ID */}
          <div className="text-center pt-6 border-t border-ink mt-8">
            <p className="italic font-sans mb-4 text-sm opacity-80 text-ink">"{flavorText}"</p>
            
            <div className="inline-block border-2 border-ink p-2 mt-4 rotate-[-2deg]">
              <span className="block text-[10px] uppercase tracking-widest opacity-60 text-ink">ID do Recibo (Rúnico)</span>
              <span className="font-mono text-xl tracking-widest font-bold text-ink">{receiptId}</span>
            </div>
            
            <div className="mt-8 opacity-40">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=O_Dragao_Agradece" alt="Selo" className="mx-auto mix-blend-multiply opacity-50" />
            </div>
          </div>

        </div>
      </div>
      <p className="text-center text-stone-500 text-xs mt-4">
        Este documento é mágico. Sua cópia (screenshot) carrega o peso legal do original.
      </p>
    </div>
  );
};

export default Invoice;
