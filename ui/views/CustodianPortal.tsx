import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, CheckCircle, Sparkles, X } from 'lucide-react';
import { theme } from '../../logic/constants';
import { Button } from '../components/Button';

interface CustodianPortalProps {
  t: any;
  navigate: (view: string) => void;
}

export const CustodianPortal: React.FC<CustodianPortalProps> = ({ t, navigate }) => {
  const [mode, setMode] = useState<'select' | 'accept' | 'release'>('select');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Reset state when switching modes
  useEffect(() => {
    setConfirmed(false);
    setAgreed(false);
    setLoading(false);
  }, [mode]);

  const handleConfirm = () => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
    }, 2000);
  };

  const CustodianTermsModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg shadow-2xl border border-[#E5E0D6] p-8 relative animate-fade-in-up">
        <button onClick={() => setShowTerms(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
        <h3 className={`${theme.fontSerif} text-2xl mb-4`}>{t.custodian.readTerms}</h3>
        <div className="prose prose-sm text-gray-600 mb-6">
          <p>{t.custodian.termsIntro}</p>
          <ul className="list-disc pl-5 space-y-2">
            {t.custodian.termsList.map((term: string, index: number) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </div>
        <Button className="w-full" onClick={() => setShowTerms(false)}>{t.custodian.termsBtn}</Button>
      </div>
    </div>
  );

  if (mode === 'select') {
    return (
      <div className={`min-h-[85vh] flex items-center justify-center ${theme.bg} py-8 px-4`}>
        <div className="max-w-md w-full bg-white p-12 shadow-sm border border-[#E5E0D6] text-center space-y-6 animate-fade-in">
          <ShieldCheck className="w-12 h-12 mx-auto text-[#C4A166]" />
          <h2 className={`${theme.fontSerif} text-2xl`}>{t.custodian.selectFlow}</h2>
          <div className="flex flex-col gap-4">
            <Button onClick={() => setMode('accept')} variant="secondary">{t.custodian.flowAccept}</Button>
            <Button onClick={() => setMode('release')} variant="secondary">{t.custodian.flowRelease}</Button>
          </div>
          <button onClick={() => navigate('home')} className="text-xs uppercase tracking-widest text-gray-400 hover:text-black mt-4">{t.custodian.back}</button>
        </div>
      </div>
    );
  }

  if (mode === 'accept') {
    return (
      <div className={`min-h-[85vh] flex items-center justify-center ${theme.bg} py-8 px-4`}>
        {showTerms && <CustodianTermsModal />}
        <div className="max-w-md w-full bg-white p-8 md:p-12 shadow-sm border border-[#E5E0D6] animate-fade-in">
          <div className="text-center mb-8">
            <Mail className="w-10 h-10 mx-auto mb-6 text-[#C4A166]" />
            <h2 className={`${theme.fontSerif} text-2xl md:text-3xl mb-2`}>{t.custodian.acceptTitle}</h2>
          </div>

          {!confirmed ? (
            <div className="animate-fade-in">
              <p className={`text-sm md:text-base leading-relaxed ${theme.textMuted} mb-8 text-center`}>
                {t.custodian.acceptBody}
              </p>
              
              <div className="mb-6 text-center">
                <button onClick={() => setShowTerms(true)} className="text-xs uppercase tracking-widest text-[#C4A166] hover:text-[#1A233A] font-bold underline">
                  {t.custodian.readTerms}
                </button>
              </div>

              <div className="mb-8 p-4 bg-[#F7F5F0] border border-[#E5E0D6] rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={agreed} 
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#C4A166] border-gray-300 rounded focus:ring-[#C4A166]"
                  />
                  <span className={`text-sm ${theme.textMain}`}>{t.custodian.acceptCheckbox}</span>
                </label>
              </div>

              <Button 
                className="w-full" 
                onClick={handleConfirm} 
                disabled={!agreed || loading}
              >
                {loading ? t.custodian.confirming : t.custodian.acceptBtn}
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className={`text-lg ${theme.textMain} mb-8`}>{t.custodian.acceptSuccess}</p>
              <Button variant="secondary" className="w-full" onClick={() => navigate('home')}>
                {t.custodian.back}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Release Flow
  return (
    <div className={`min-h-[85vh] flex items-center justify-center ${theme.bg} py-8 px-4`}>
      <div className="max-w-lg w-full bg-white p-8 md:p-12 shadow-sm border border-[#E5E0D6] animate-fade-in">
        <div className="text-center mb-8">
          <ShieldCheck className="w-10 h-10 mx-auto mb-6 text-[#C4A166]" />
          <h2 className={`${theme.fontSerif} text-2xl md:text-3xl mb-2`}>{t.custodian.dashboardTitle}</h2>
        </div>

        {!confirmed ? (
          <div className="space-y-6">
            {/* Mock Message Card */}
            <div className="p-6 border border-[#E5E0D6] rounded-lg bg-[#F7F5F0]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#5D6B82]">{t.custodian.messageFrom}</p>
                  <p className={`text-xl ${theme.fontSerif} text-[#1A233A]`}>Sarah</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] uppercase tracking-widest font-bold rounded-full">
                  {t.custodian.statusActive}
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                 <p className="text-xs text-[#5D6B82]">{t.custodian.status}: <span className="text-[#1A233A] font-medium">{t.custodian.statusWaiting}</span></p>
              </div>
              
              <div className="border-t border-[#E5E0D6] pt-4 mt-4">
                 <p className="text-sm text-[#1A233A] mb-4 font-medium">{t.custodian.confirmTitle}</p>
                 <p className="text-xs text-[#5D6B82] mb-4">{t.custodian.confirmBody}</p>
                 
                 <div className="mb-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agreed} 
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-600"
                      />
                      <span className={`text-xs font-bold text-red-800`}>{t.custodian.confirmCheckbox}</span>
                    </label>
                 </div>

                 <Button 
                    variant="secondary"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    onClick={handleConfirm} 
                    disabled={!agreed || loading}
                  >
                    {loading ? t.custodian.confirming : t.custodian.releaseBtn}
                  </Button>
              </div>
            </div>
            <button onClick={() => setMode('select')} className="w-full text-center text-xs uppercase tracking-widest text-gray-400 hover:text-black">{t.custodian.back}</button>
          </div>
        ) : (
          <div className="animate-fade-in text-center">
            <div className="w-16 h-16 bg-[#1A233A] rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-[#C4A166]" />
            </div>
            <p className={`text-lg ${theme.textMain} mb-8`}>{t.custodian.releaseSuccess}</p>
            <Button variant="secondary" className="w-full" onClick={() => navigate('home')}>
              {t.custodian.back}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
