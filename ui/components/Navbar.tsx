import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { theme } from '../../logic/constants';
import { ArchIcon } from './ArchIcon';

interface NavbarProps {
  t: any;
  user: any;
  setUser: (user: any) => void;
  navigate: (view: string) => void;
  lang: string;
  setLang: (lang: string) => void;
  setShowSettings: (show: boolean) => void;
  setSettingsOnlyProfile: (only: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ t, user, setUser, navigate, lang, setLang, setShowSettings, setSettingsOnlyProfile }) => {
  return (
    <>
      {/* Desktop Nav */}
      <nav className={`hidden md:flex w-full px-10 py-8 justify-between items-center ${theme.bg} border-b border-[#E5E0D6]/40`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('home')}>
          <ArchIcon className={`w-9 h-9 ${theme.textMain} group-hover:text-[#C4A166] transition-all duration-700`} />
          <span className={`text-3xl ${theme.fontSerif} tracking-[0.1em] ${theme.textMain}`}>COFRIA</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity">
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          
          {user && (
            <button onClick={() => { setSettingsOnlyProfile(true); setShowSettings(true); }} className="opacity-30 hover:opacity-100 transition-opacity text-[#1A233A]">
                <User size={20} />
            </button>
          )}

          {user ? (
              <button onClick={() => { setUser(null); navigate('home'); }} className="opacity-30 hover:text-red-600 transition-all text-[#1A233A]">
                <LogOut size={20} />
              </button>
          ) : (
            <button onClick={() => navigate('login')} className="text-[10px] uppercase tracking-[0.3em] font-black opacity-60 hover:opacity-100 hover:text-[#C4A166] transition-all">
              {t.nav.login}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className={`md:hidden w-full py-8 flex justify-center items-center ${theme.bg}`}>
         <div className="flex items-center gap-3" onClick={() => navigate('home')}>
            <ArchIcon className={`w-10 h-10 ${theme.textMain}`} />
            <span className={`text-3xl ${theme.fontSerif} tracking-[0.1em] ${theme.textMain}`}>COFRIA</span>
         </div>
      </nav>

      {/* Mobile Bottom Floating Nav */}
      {user && (
        <div className="md:hidden fixed bottom-6 right-6 w-12 h-auto flex flex-col items-center gap-6 py-4 bg-[#1A233A]/90 backdrop-blur-md rounded-full shadow-2xl z-40 border border-[#E5E0D6]/10">
            <button onClick={() => setShowSettings(true)} className="text-[#F7F5F0]/60 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
            
            <button onClick={() => { setUser(null); navigate('home'); }} className="text-[#F7F5F0]/60 hover:text-red-400 transition-colors">
              <LogOut size={20} />
            </button>
        </div>
      )}
    </>
  );
};
