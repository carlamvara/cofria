import React from 'react';
import { ArchIcon } from './ArchIcon';
import { Shield } from 'lucide-react';

interface FooterProps {
  t: any;
  lang: string;
  setActiveModal: (modal: string) => void;
  navigate: (view: string) => void;
  setShowAdminLogin: (show: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ t, lang, setActiveModal, navigate, setShowAdminLogin }) => {
  return (
    <footer className="py-4 md:py-24 text-center px-4 md:px-10 mt-0 md:mt-12 border-t border-[#E5E0D6]/40 bg-white/30 pb-24 md:pb-24">
      <div className="max-w-4xl mx-auto">
        <ArchIcon className="hidden md:block w-8 h-8 md:w-12 md:h-12 mx-auto mb-6 md:mb-12 opacity-5" />
        <p className="hidden md:block text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.5em] opacity-30 font-black mb-6 md:mb-16">© 2026 COFRIA. {lang === 'en' ? 'Custody of Time & Will.' : 'Custodia de Tiempo y Voluntad.'}</p>
        <div className="hidden md:flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-12 md:gap-y-6 pt-6 md:pt-12 border-t border-[#E5E0D6]/20">
          {['terms', 'privacy', 'security'].map(item => (
            <span key={item} onClick={() => setActiveModal(item)} className="text-[9px] md:text-xs uppercase tracking-widest font-black opacity-20 hover:opacity-60 cursor-pointer transition-opacity">{t.footer[item]}</span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-12 md:gap-y-6 pt-2 md:pt-12 mt-2 md:mt-12 md:border-t border-[#E5E0D6]/20 relative">
          <button 
            onClick={() => setShowAdminLogin(true)} 
            className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-[0.03] hover:opacity-20 transition-opacity p-4"
            title="Restricted"
          >
            <Shield size={12} />
          </button>

          <span onClick={() => navigate('custodian-demo')} className="text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#C4A166] hover:opacity-100 cursor-pointer transition-all italic font-black">{t.hero.demoCustodian}</span>
          <span onClick={() => navigate('view-demo')} className="text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#C4A166] hover:opacity-100 cursor-pointer transition-all italic font-black">{t.hero.demoRecipient}</span>
        </div>
      </div>
    </footer>
  );
};
