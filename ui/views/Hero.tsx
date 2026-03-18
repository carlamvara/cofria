import React from 'react';
import { theme } from '../../logic/constants';
import { Button } from '../components/Button';
import { Edit3, Lock, Clock, Send, Fingerprint, ChevronRight } from 'lucide-react';

interface HeroProps {
  t: any;
  user: any;
  navigate: (view: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ t, user, navigate }) => {
  const steps = [
    {
      icon: <Edit3 size={28} />,
      title: "Escribe o Graba",
      desc: "Redacta tu mensaje, graba un audio o video. Lo que hoy no puedes decir, mañana será un tesoro.",
    },
    {
      icon: <Lock size={28} />,
      title: "Sella y Encripta",
      desc: "Tu mensaje se encripta con tecnología de punta. Nadie, ni siquiera nosotros, puede leerlo antes de tiempo.",
    },
    {
      icon: <Clock size={28} />,
      title: "Define el Momento",
      desc: "Elige una fecha específica o designa un custodio de confianza para que el mensaje se entregue cuando tú decidas.",
    },
    {
      icon: <Send size={28} />,
      title: "Entrega Segura",
      desc: "Cuando llegue el momento, COFRIA se asegura de que tu legado llegue a las manos correctas.",
    }
  ];

  return (
    <>
      {/* MOBILE VIEW - PRESERVED EXACTLY AS IS */}
      <div className={`md:hidden min-h-[80vh] flex flex-col items-center justify-center text-center px-6 ${theme.bg}`}>
        <div className="max-w-2xl animate-fade-in-up">
          <div className="mb-8 flex justify-center"><div className="w-px h-16 bg-[#C4A166] animate-blink"></div></div>
          <h1 className={`text-4xl ${theme.fontSerif} ${theme.textMain} mb-8 leading-tight`}>{t.hero.headline}</h1>
          <p className={`text-base ${theme.textMuted} mb-12 font-light max-w-lg mx-auto leading-relaxed`}>{t.hero.subhead}</p>
          <Button onClick={() => user ? navigate('dashboard') : navigate('onboarding')} className="button-magical min-w-[260px]">{t.hero.cta}</Button>
        </div>
      </div>

      {/* DESKTOP VIEW - NEW LANDING PAGE */}
      <div className={`hidden md:flex flex-col w-full ${theme.bg}`}>
        
        {/* Hero Section with Parallax Background */}
        <div className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
           
           {/* Parallax Background Image */}
           <div 
             className="absolute inset-0 z-0 bg-fixed bg-center bg-cover"
             style={{ 
               backgroundImage: "url('/cofria-home.png')" 
             }}
           >
             {/* Gradient Overlay for Text Readability */}
             <div className="absolute inset-0 bg-black/40"></div>
           </div>

           {/* Centered Content Overlay */}
           <div className="relative z-10 text-center max-w-5xl px-6 mt-[-50px] animate-fade-in-up">
              <div className="w-px h-24 bg-white/80 mx-auto mb-8 animate-blink shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
              
              <h1 className={`text-7xl lg:text-8xl ${theme.fontSerif} text-white mb-8 leading-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)]`}>
                {t.hero.headline}
              </h1>
              
              <p className={`text-2xl text-white/95 mb-12 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)]`}>
                {t.hero.subhead}
              </p>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => user ? navigate('dashboard') : navigate('onboarding')} 
                  className="button-magical px-12 py-6 text-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[#C4A166]/40 transform hover:-translate-y-1 transition-all border-white/20 backdrop-blur-sm"
                >
                  {t.hero.cta}
                </Button>
              </div>
           </div>
        </div>

        {/* How it Works Section - Luxury Dark Theme */}
        <div className="w-full bg-[#1A233A] py-32 relative overflow-hidden">
           {/* Subtle Gold Gradient Overlay */}
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

           <div className="max-w-7xl mx-auto px-12 relative z-10">
             <div className="text-center mb-24">
               <h2 className={`${theme.fontSerif} text-4xl text-white mb-6`}>El Legado Digital</h2>
               <div className="w-px h-16 bg-[#C4A166] mx-auto shadow-[0_0_15px_#C4A166]"></div>
             </div>

             <div className="grid grid-cols-4 gap-8">
               {steps.map((step, index) => (
                 <div key={index} className="group relative">
                   {/* Connecting Line */}
                   {index < steps.length - 1 && (
                     <div className="absolute top-8 left-1/2 w-full h-px bg-white/5 hidden md:block group-hover:bg-[#C4A166]/30 transition-colors duration-700"></div>
                   )}
                   
                   <div className="relative z-10 flex flex-col items-center text-center p-8 rounded-2xl border border-white/5 hover:border-[#C4A166]/30 hover:bg-white/5 transition-all duration-500 group-hover:-translate-y-2 backdrop-blur-sm">
                     <div className={`w-16 h-16 rounded-full border border-[#C4A166]/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(196,161,102,0.1)] group-hover:shadow-[0_0_30px_rgba(196,161,102,0.3)] transition-all duration-500 text-[#C4A166]`}>
                       {step.icon}
                     </div>
                     <h3 className={`text-lg font-bold text-white mb-4 uppercase tracking-widest`}>{step.title}</h3>
                     <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                       {step.desc}
                     </p>
                   </div>
                 </div>
               ))}
             </div>

             {/* Bottom CTA */}
             <div className="mt-24 text-center">
               <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 rounded-full border border-white/10 text-xs uppercase tracking-widest text-gray-400 hover:border-[#C4A166]/30 hover:text-[#C4A166] transition-all duration-500 cursor-default">
                 <Fingerprint size={16} className="text-[#C4A166]" />
                 <span>Tu privacidad es nuestra prioridad absoluta</span>
               </div>
             </div>
           </div>
           
           {/* Decorative Background Text */}
           <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none">
             <h2 className="text-[20vw] font-black text-white leading-none whitespace-nowrap">COFRIA LEGACY</h2>
           </div>
        </div>

        {/* Professionals Section - Lower Relevance */}
        <div className={`w-full py-24 ${theme.bg} border-t border-[#E5E0D6]/40`}>
           <div className="max-w-7xl mx-auto px-12 text-center">
              <h2 className={`${theme.fontSerif} text-4xl text-[#1A233A] mb-4 uppercase tracking-widest`}>{t.professionals.title}</h2>
              <p className={`${theme.textMuted} text-xl mb-12 max-w-3xl mx-auto font-light italic`}>{t.professionals.subtitle}</p>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => navigate('professional-list')}
                  className="group flex items-center gap-3 text-xs uppercase tracking-[0.3em] font-black text-[#1A233A] hover:text-[#C4A166] transition-all"
                >
                  <div className="w-10 h-px bg-[#1A233A] group-hover:bg-[#C4A166] transition-all"></div>
                  {t.professionals.cta}
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
           </div>
        </div>

      </div>
    </>
  );
};