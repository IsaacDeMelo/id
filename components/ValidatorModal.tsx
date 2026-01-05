import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from './Button';

interface ValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ValidatorModal: React.FC<ValidatorModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  if (!isOpen) return null;

  const validateToken = () => {
    // 1. Format Check: RPG-[4 Letters]-[4 Letters]-[4 Numbers]
    const regex = /^RPG-[A-Z]{4}-[A-Z]{4}-\d{4}$/;
    
    if (!regex.test(token)) {
      setStatus('invalid');
      return;
    }

    // 2. Sum Check: Last 4 digits sum must be 21
    const parts = token.split('-');
    const numbersPart = parts[3]; // "9534"
    const sum = numbersPart.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);

    if (sum === 21) {
      setStatus('valid');
    } else {
      setStatus('invalid');
    }
  };

  const handleClose = () => {
    setToken('');
    setStatus('idle');
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-gold/30 rounded-lg max-w-md w-full shadow-[0_0_30px_rgba(212,175,55,0.15)] relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-700">
            <ShieldCheck size={32} className="text-gold" />
          </div>
          
          <h2 className="font-serif text-2xl text-stone-100 mb-2">Verificar Autenticidade</h2>
          <p className="text-stone-400 mb-6 text-sm">
            Insira o código rúnico (ID do Recibo) para verificar se o documento foi emitido legalmente pelo Empório.
          </p>

          <div className="relative mb-4">
            <input 
              type="text" 
              value={token}
              onChange={(e) => {
                setToken(e.target.value.toUpperCase());
                setStatus('idle');
              }}
              placeholder="RPG-ABCD-EFGH-0000"
              className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-center font-mono text-lg tracking-widest text-gold placeholder-stone-700 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {status === 'idle' && (
             <Button className="w-full" onClick={validateToken} disabled={token.length === 0}>
               Verificar
             </Button>
          )}

          {status === 'valid' && (
            <div className="bg-green-900/20 border border-green-800 rounded p-4 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-green-400 font-bold mb-1">
                <CheckCircle size={20} />
                <span>Documento Legítimo</span>
              </div>
              <p className="text-xs text-green-200/70">A assinatura mágica confere.</p>
            </div>
          )}

          {status === 'invalid' && (
            <div className="bg-red-900/20 border border-red-800 rounded p-4 animate-shake">
               <div className="flex items-center justify-center gap-2 text-red-400 font-bold mb-1">
                <AlertTriangle size={20} />
                <span>Falsificação Detectada</span>
              </div>
              <p className="text-xs text-red-200/70">Este documento não possui a aura do dragão.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidatorModal;
