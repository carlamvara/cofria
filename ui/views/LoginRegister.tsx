import React, { useState, useRef } from 'react';
import { Mail, User, ShieldCheck } from 'lucide-react';
import { theme, PROFESSIONS } from '../../logic/constants';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArchIcon } from '../components/ArchIcon';
import { COUNTRIES } from '../../logic/countries';
import { getFlagEmoji } from '../../logic/utils';

interface LoginRegisterProps {
  t: any;
  setUser: (user: any) => void;
  navigate: (view: string) => void;
  isModal?: boolean;
  onSuccess?: () => void;
}

export const LoginRegister: React.FC<LoginRegisterProps> = ({ t, setUser, navigate, isModal, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loginMethod, setLoginMethod] = useState<'email' | 'sms'>('email');
  const [formData, setFormData] = useState({ 
    name: '', 
    surname: '', 
    email: '', 
    phone: '', 
    country: 'ES',
    profession: '',
    customProfession: '',
    licenseNumber: '',
    businessAddress: '',
    businessPhone: '',
    webLinks: '',
    socialMedia: '',
    instagram: '',
    facebook: '',
    patientCount: ''
  });

  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleEmailSubmit = () => {
    if (loginMethod === 'email' && formData.email) setStep('otp');
    if (loginMethod === 'sms' && formData.phone) setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 4).split('');
      const newOtp = [...otpValues];
      pasted.forEach((char, i) => {
        if (index + i < 4) newOtp[index + i] = char;
      });
      setOtpValues(newOtp);
      const nextIndex = Math.min(index + pasted.length, 3);
      otpRefs[nextIndex].current?.focus();
      return;
    }

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpSubmit = () => {
    const otpCode = otpValues.join('');
    if (otpCode.length === 4) {
      setUser({ ...formData, profession: (formData.profession === 'health' || formData.profession === 'other') ? formData.customProfession : formData.profession, isProfessional, otp: otpCode, paymentMethods: [{ id: 'card_123', brand: 'Visa', last4: '4242' }] });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(isProfessional ? 'professional-dashboard' : 'dashboard');
      }
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setFormData(prev => ({ ...prev, country: code }));
  };

  const isOtpComplete = otpValues.every(v => v !== '');

  const getTitle = () => {
    if (isProfessional) {
      return isRegister ? t.auth.registerProfTitle : t.auth.loginProfTitle;
    }
    return isRegister ? t.auth.registerTitle : t.auth.loginTitle;
  };

  return (
    <div className={isModal ? "w-full" : `min-h-[85vh] flex items-center justify-center ${theme.bg} py-8 px-4`}>
      <div className={`max-w-md w-full bg-white p-8 md:p-12 shadow-sm border border-[#E5E0D6] animate-fade-in ${isModal ? 'mx-auto' : ''}`}>
        {step === 'email' ? (
          <>
            <div className="text-center mb-8">
              <ArchIcon className="w-10 h-10 mx-auto mb-6 text-[#C4A166]" />
              <h2 className={`${theme.fontSerif} text-2xl md:text-3xl mb-2`}>{getTitle()}</h2>
              <p className={`text-sm md:text-base ${theme.textMuted}`}>{t.auth.subtitle}</p>
            </div>
            
            {isRegister ? (
              <div className="animate-fade-in space-y-4">
                <Input label={t.auth.emailReq} icon={<Mail size={16}/>} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@example.com" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label={t.auth.name} icon={<User size={16}/>} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John" />
                  <Input label={t.auth.surname} value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} placeholder="Doe" />
                </div>

                {isProfessional && (
                  <div className="animate-fade-in space-y-4">
                    <div className="text-left">
                      <label className="block text-xs uppercase tracking-widest text-[#5D6B82] mb-2">{t.profile.profession}</label>
                      <select className={`w-full bg-white border ${theme.border} p-3 text-base focus:outline-none focus:border-[#1A233A] transition-colors`} value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})}>
                        <option value="">Seleccionar profesión</option>
                        {PROFESSIONS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    {(formData.profession === 'health' || formData.profession === 'other') && (
                      <Input 
                        label="Especificar profesión" 
                        value={formData.customProfession} 
                        onChange={e => setFormData({...formData, customProfession: e.target.value})} 
                        placeholder="Ej: Nutricionista, Mediador..." 
                      />
                    )}
                    <Input label={t.profile.license + " (opcional)"} value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} placeholder="Nº Colegiado / Licencia" />
                    <Input label="Dirección del Consultorio/Negocio (opcional)" value={formData.businessAddress} onChange={e => setFormData({...formData, businessAddress: e.target.value})} placeholder="Calle, Ciudad, CP" />
                    <Input label="Teléfono del Consultorio (opcional)" value={formData.businessPhone} onChange={e => setFormData({...formData, businessPhone: e.target.value})} placeholder="+34..." />
                    <Input label="Web (opcional)" value={formData.webLinks} onChange={e => setFormData({...formData, webLinks: e.target.value})} placeholder="https://..." />
                    <Input label="LinkedIn (opcional)" value={formData.socialMedia} onChange={e => setFormData({...formData, socialMedia: e.target.value})} placeholder="https://linkedin.com/in/..." />
                    <Input label="Instagram (opcional)" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} placeholder="@usuario" />
                    <Input label="Facebook (opcional)" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} placeholder="facebook.com/..." />
                    <Input label="Cantidad de pacientes/clientes (Opcional)" value={formData.patientCount} onChange={e => setFormData({...formData, patientCount: e.target.value})} placeholder="Ej: 50" />
                  </div>
                )}
                
                <div className="text-left">
                  <label className="block text-xs uppercase tracking-widest text-[#5D6B82] mb-2">{t.auth.country}</label>
                  <select className={`w-full bg-white border ${theme.border} p-3 text-base focus:outline-none focus:border-[#1A233A] transition-colors`} value={formData.country} onChange={handleCountryChange}>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{getFlagEmoji(c.code)} {c.name}</option>)}
                  </select>
                </div>

                <div className="text-left">
                  <label className={`block text-xs md:text-sm uppercase tracking-widest ${theme.textMuted} mb-2`}>{t.auth.phoneOpt}</label>
                  <div className="flex gap-2">
                    <select className={`w-28 bg-white border ${theme.border} p-3 text-base focus:outline-none focus:border-[#1A233A] transition-colors`} value={formData.country} onChange={handleCountryChange}>
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{getFlagEmoji(c.code)} {c.dialCode}</option>)}
                    </select>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="600..." className={`flex-1 bg-white border ${theme.border} p-3 text-base focus:outline-none focus:border-[#1A233A] transition-colors`} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {loginMethod === 'email' ? (
                  <Input label={t.auth.email} icon={<Mail size={16}/>} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@example.com" />
                ) : (
                  <div className="text-left">
                    <label className={`block text-xs md:text-sm uppercase tracking-widest ${theme.textMuted} mb-2`}>{t.auth.phone}</label>
                    <div className="flex gap-2">
                      <select className={`w-28 bg-white border ${theme.border} p-3 text-base focus:outline-none focus:border-[#1A233A] transition-colors`} value={formData.country} onChange={handleCountryChange}>
                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{getFlagEmoji(c.code)} {c.dialCode}</option>)}
                      </select>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="600..." className={`flex-1 bg-white border ${theme.border} p-3 text-base focus:outline-none focus:border-[#1A233A] transition-colors`} />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-8 space-y-4">
              <Button className="w-full" onClick={handleEmailSubmit}>
                {isRegister 
                  ? (isProfessional ? t.auth.registerAsProfessional : t.auth.submitReg) 
                  : t.auth.submitLogin
                }
              </Button>

              {!isRegister && (
                <button 
                  onClick={() => setLoginMethod(prev => prev === 'email' ? 'sms' : 'email')} 
                  className="w-full text-center text-xs uppercase tracking-widest text-[#5D6B82] hover:text-[#1A233A] underline transition-colors"
                >
                  {loginMethod === 'email' ? t.auth.smsOption : t.auth.emailOption}
                </button>
              )}

              <div className="pt-4 border-t border-[#F7F5F0] space-y-3">
                {isProfessional ? (
                  <>
                    <button onClick={() => { setIsProfessional(false); setIsRegister(false); }} className="w-full text-center text-[10px] uppercase tracking-widest text-[#5D6B82] hover:text-[#1A233A] transition-colors">
                      {t.auth.loginAsUser}
                    </button>
                    <button onClick={() => { setIsProfessional(true); setIsRegister(!isRegister); }} className="w-full text-center text-[10px] uppercase tracking-widest text-[#C4A166] hover:text-[#1A233A] transition-colors">
                      {isRegister ? t.auth.alreadyHave : t.auth.createNew}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setIsProfessional(true); setIsRegister(isRegister); }} className="w-full text-center text-[10px] uppercase tracking-widest text-[#5D6B82] hover:text-[#1A233A] transition-colors">
                      {isRegister ? t.auth.registerAsProfessional : t.auth.loginAsProfessional}
                    </button>
                    <button onClick={() => setIsRegister(!isRegister)} className="w-full text-center text-[10px] uppercase tracking-widest text-[#C4A166] hover:text-[#1A233A] transition-colors">
                      {isRegister ? t.auth.alreadyHave : t.auth.createNew}
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <ShieldCheck className="w-10 h-10 mx-auto mb-6 text-[#C4A166]" />
              <h2 className={`${theme.fontSerif} text-2xl md:text-3xl mb-2`}>{t.auth.otpTitle}</h2>
              <p className={`text-sm md:text-base ${theme.textMuted}`}>{loginMethod === 'sms' ? t.auth.otpDescSms : t.auth.otpDesc}</p>
            </div>
            
            <div className="flex justify-center gap-3 mb-8">
              {otpValues.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  maxLength={4} // Allow paste
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`w-14 h-16 text-center text-2xl font-serif bg-white border ${theme.border} focus:outline-none focus:border-[#1A233A] transition-colors rounded-md`}
                />
              ))}
            </div>

            <Button className="w-full" onClick={handleOtpSubmit} disabled={!isOtpComplete}>{t.auth.submitOtp}</Button>
            <button onClick={() => setStep('email')} className="w-full text-center mt-6 text-xs uppercase tracking-widest text-[#5D6B82] hover:text-[#1A233A] underline">
              {t.editor.backBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
