import React, { useState } from 'react';
import { theme } from '../../logic/constants';
import { Button } from '../components/Button';
import { ArchIcon } from '../components/ArchIcon';
import { Edit3, Lock, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingProps {
  t: any;
  navigate: (view: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ t, navigate }) => {
  const [step, setStep] = useState(1);

  const images = [
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop"
  ];

  return (
    <div className={`min-h-[85vh] flex items-center justify-center ${theme.bg} py-12 px-4`}>
      <div className="max-w-4xl w-full bg-white p-8 md:p-16 shadow-sm border border-[#E5E0D6] animate-fade-in relative">
        
        {step === 1 && (
          <div className="animate-fade-in-up text-center">
            <ArchIcon className="w-12 h-12 text-[#C4A166] mx-auto mb-8" />
            <h2 className={`${theme.fontSerif} text-3xl md:text-5xl text-[#1A233A] mb-12`}>{t.onboarding.title1}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {t.onboarding.moments.map((moment: any, idx: number) => (
                <div key={idx} className="group relative overflow-hidden rounded-lg aspect-[3/4] shadow-md bg-black">
                  <img 
                    src={images[idx]} 
                    alt={moment.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:sepia group-hover:opacity-60" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 text-left">
                    <div className="transition-all duration-500 transform translate-y-0 group-hover:-translate-y-2">
                      <h3 className={`${theme.fontSerif} text-white text-xl md:text-2xl mb-2`}>
                        {moment.title}
                      </h3>
                      <p className="text-white/0 group-hover:text-white/90 text-[10px] md:text-xs leading-relaxed transition-all duration-500 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-32 overflow-hidden">
                        {moment.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => setStep(2)} className="px-12 py-4 text-lg flex items-center justify-center gap-2 mx-auto">
              {t.onboarding.step1Cta} <ChevronRight size={20} />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up text-center">
            <h2 className={`${theme.fontSerif} text-3xl md:text-5xl text-[#1A233A] mb-16`}>{t.onboarding.howItWorks}</h2>
            
            <div className="max-w-2xl mx-auto space-y-12 mb-16 text-left">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-[#F7F5F0] flex items-center justify-center shrink-0 border border-[#E5E0D6]">
                  <Edit3 size={24} className="text-[#C4A166]" />
                </div>
                <div>
                  <h3 className={`${theme.fontSerif} text-xl text-[#1A233A] mb-2`}>{t.onboarding.step1.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{t.onboarding.step1.desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-[#F7F5F0] flex items-center justify-center shrink-0 border border-[#E5E0D6]">
                  <Clock size={24} className="text-[#C4A166]" />
                </div>
                <div>
                  <h3 className={`${theme.fontSerif} text-xl text-[#1A233A] mb-2`}>{t.onboarding.step2.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{t.onboarding.step2.desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-[#F7F5F0] flex items-center justify-center shrink-0 border border-[#E5E0D6]">
                  <Lock size={24} className="text-[#C4A166]" />
                </div>
                <div>
                  <h3 className={`${theme.fontSerif} text-xl text-[#1A233A] mb-2`}>{t.onboarding.step3.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{t.onboarding.step3.desc}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center max-w-2xl mx-auto">
              <button onClick={() => setStep(1)} className="text-sm uppercase tracking-widest text-gray-400 hover:text-[#1A233A] transition-colors flex items-center gap-2">
                <ChevronLeft size={16} /> {t.onboarding.back}
              </button>
              <Button onClick={() => navigate('create')} className="px-12 py-4 text-lg">
                {t.onboarding.finalCta}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
