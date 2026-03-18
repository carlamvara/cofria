import React, { useState } from 'react';
import { X, ArrowRight, ShieldAlert } from 'lucide-react';
import { theme } from '../../logic/constants';
import { Button } from './Button';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (password: string) => void;
  t: any;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin, t }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Mock password
      onLogin(password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1A233A] w-full max-w-xs p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <X size={18} />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C4A166]">
            <ShieldAlert size={24} />
          </div>
          <h3 className="text-white text-xs uppercase tracking-[0.3em] font-black opacity-60">{t.admin.restricted}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.admin.password}
              className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 px-5 text-white text-sm focus:outline-none focus:border-[#C4A166] transition-all placeholder:text-white/20`}
              autoFocus
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#C4A166] text-[#1A233A] rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {error && <p className="text-red-400 text-[10px] text-center uppercase tracking-widest animate-shake">{t.admin.error}</p>}

          <div className="pt-4 text-center">
            {resetSent ? (
              <p className="text-emerald-400 text-[10px] uppercase tracking-widest leading-relaxed">{t.admin.resetSent}</p>
            ) : (
              <button 
                type="button"
                onClick={() => setResetSent(true)}
                className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors"
              >
                {t.admin.forgot}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
