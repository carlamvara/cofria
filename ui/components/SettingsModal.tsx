import React, { useState } from 'react';
import { X, Edit2, Check, Smartphone, Mail as MailIcon, CreditCard, User, Globe, Coins, Shield, ChevronRight } from 'lucide-react';
import { theme, PROFESSIONS } from '../../logic/constants';
import { Button } from './Button';
import { Input } from './Input';
import { COUNTRIES } from '../../logic/countries';
import { getFlagEmoji } from '../../logic/utils';

interface SettingsModalProps {
  onClose: () => void;
  user: any;
  setUser: (user: any) => void;
  t: any;
  setLang: (lang: string) => void;
  lang: string;
  setActiveModal: (modal: string) => void;
  onlyProfile?: boolean;
  setShowProfessionalRequest: (show: boolean) => void;
  navigate: (view: string) => void;
  currentView: string;
  setShowBusinessEdit: (show: boolean) => void;
  setShowPaymentMethods: (show: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, user, setUser, t, setLang, lang, setActiveModal, onlyProfile = false, setShowProfessionalRequest, navigate, currentView, setShowBusinessEdit, setShowPaymentMethods }) => {
  const [formData, setFormData] = useState({ 
    email: user?.email || '', 
    phone: user?.phone || '',
    name: user?.name || '',
    surname: user?.surname || '',
    country: user?.country || 'ES'
  });
  const [isEditing, setIsEditing] = useState<string | null>(null); // null, 'name', 'country', 'email', 'phone'
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpMethod, setOtpMethod] = useState<'email' | 'sms'>(user?.preferredMethod || 'email');

  const handleSaveField = (field: string) => {
    if (field === 'email' || field === 'phone') {
      setShowOtp(true);
    } else {
      setUser({ ...user, ...formData });
      setIsEditing(null);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') { // Mock verification
      if (user) {
        setUser({ ...user, ...formData, preferredMethod: otpMethod });
      }
      setIsEditing(null);
      setShowOtp(false);
      setOtp('');
    } else {
      alert('Código incorrecto');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F7F5F0] sm:bg-white w-full h-full sm:h-auto sm:max-w-md shadow-2xl border-none sm:border sm:border-[#E5E0D6] p-0 sm:p-6 relative animate-fade-in-up sm:rounded-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-0 border-b border-[#E5E0D6] sm:border-none bg-white sm:bg-transparent sticky top-0 z-10">
          <h3 className={`${theme.fontSerif} text-xl sm:text-2xl text-[#1A233A]`}>{t.settings.title}</h3>
          <button onClick={onClose} className="text-[#C4A166] sm:text-gray-400 hover:text-black p-2 text-sm font-bold sm:font-normal uppercase tracking-widest sm:normal-case sm:tracking-normal">
            <span className="sm:hidden">{t.settings.done}</span>
            <X size={20} className="hidden sm:block" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-0 space-y-6">
          {/* Language */}
          {!onlyProfile && (
          <div className="bg-white sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none shadow-sm sm:shadow-none">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#5D6B82] mb-3 font-bold">{t.settings.language}</h4>
            <div className="flex gap-2">
                <button onClick={() => setLang('es')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border rounded-lg transition-all ${lang === 'es' ? 'bg-[#1A233A] text-white border-[#1A233A]' : 'border-[#E5E0D6] text-[#5D6B82] hover:bg-gray-50'}`}>Español</button>
                <button onClick={() => setLang('en')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border rounded-lg transition-all ${lang === 'en' ? 'bg-[#1A233A] text-white border-[#1A233A]' : 'border-[#E5E0D6] text-[#5D6B82] hover:bg-gray-50'}`}>English</button>
            </div>
          </div>
          )}

          {/* Profile */}
          {user && (
              <div className="space-y-6">
                <div className="bg-white sm:bg-transparent rounded-xl sm:rounded-none shadow-sm sm:shadow-none overflow-hidden">
                  <h4 className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-[#5D6B82] mb-4 font-bold">{t.settings.profile}</h4>
                  
                  <div className="divide-y divide-gray-50 sm:divide-none sm:space-y-6">
                      {/* Name */}
                      <div className="flex justify-between items-center group p-4 sm:p-0 hover:bg-gray-50 sm:hover:bg-transparent transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-[#1A233A]/5 flex items-center justify-center text-[#1A233A] sm:hidden">
                            <User size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="hidden sm:block text-[10px] uppercase tracking-widest text-gray-400 mb-1">{t.auth.name}</p>
                            {isEditing === 'name' ? (
                              <div className="flex gap-2">
                                <input className="flex-1 border-b border-[#1A233A] focus:outline-none text-sm py-1 bg-transparent" value={`${formData.name} ${formData.surname}`} onChange={e => {
                                  const parts = e.target.value.split(' ');
                                  setFormData({...formData, name: parts[0] || '', surname: parts.slice(1).join(' ') || ''});
                                }} autoFocus />
                                <button onClick={() => handleSaveField('name')} className="text-emerald-600"><Check size={16}/></button>
                              </div>
                            ) : (
                              <p className="text-sm font-medium text-[#1A233A]">{user.name} {user.surname}</p>
                            )}
                          </div>
                        </div>
                        {!isEditing && <button onClick={() => setIsEditing('name')} className="sm:opacity-0 group-hover:opacity-100 text-[#C4A166] transition-opacity p-2"><Edit2 size={14}/></button>}
                      </div>

                      {/* Country */}
                      <div className="flex justify-between items-center group p-4 sm:p-0 hover:bg-gray-50 sm:hover:bg-transparent transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-[#1A233A]/5 flex items-center justify-center text-[#1A233A] sm:hidden">
                            <Globe size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="hidden sm:block text-[10px] uppercase tracking-widest text-gray-400 mb-1">{t.auth.country}</p>
                            {isEditing === 'country' ? (
                              <div className="flex gap-2">
                                <select className="flex-1 border-b border-[#1A233A] focus:outline-none text-sm py-1 bg-transparent" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} autoFocus>
                                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{getFlagEmoji(c.code)} {c.name}</option>)}
                                </select>
                                <button onClick={() => handleSaveField('country')} className="text-emerald-600"><Check size={16}/></button>
                              </div>
                            ) : (
                              <p className="text-sm font-medium text-[#1A233A]">{getFlagEmoji(user.country)} {COUNTRIES.find(c => c.code === user.country)?.name}</p>
                            )}
                          </div>
                        </div>
                        {!isEditing && <button onClick={() => setIsEditing('country')} className="sm:opacity-0 group-hover:opacity-100 text-[#C4A166] transition-opacity p-2"><Edit2 size={14}/></button>}
                      </div>

                      {/* Email */}
                      <div className="flex justify-between items-center group p-4 sm:p-0 hover:bg-gray-50 sm:hover:bg-transparent transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-[#1A233A]/5 flex items-center justify-center text-[#1A233A] sm:hidden">
                            <MailIcon size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="hidden sm:block text-[10px] uppercase tracking-widest text-gray-400 mb-1">{t.auth.email}</p>
                            {isEditing === 'email' ? (
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <input className="flex-1 border-b border-[#1A233A] focus:outline-none text-sm py-1 bg-transparent" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} autoFocus />
                                  <button onClick={() => handleSaveField('email')} className="text-emerald-600"><Check size={16}/></button>
                                </div>
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#5D6B82] cursor-pointer">
                                  <input type="checkbox" checked={otpMethod === 'email'} onChange={() => setOtpMethod('email')} className="accent-[#1A233A]" />
                                  {t.profile.useForCodes}
                                </label>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-[#1A233A] truncate max-w-[150px] sm:max-w-none">{user.email}</p>
                                {otpMethod === 'email' && <MailIcon size={12} className="text-[#C4A166]" />}
                              </div>
                            )}
                          </div>
                        </div>
                        {!isEditing && <button onClick={() => setIsEditing('email')} className="sm:opacity-0 group-hover:opacity-100 text-[#C4A166] transition-opacity p-2"><Edit2 size={14}/></button>}
                      </div>

                      {/* Phone */}
                      <div className="flex justify-between items-center group p-4 sm:p-0 hover:bg-gray-50 sm:hover:bg-transparent transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-[#1A233A]/5 flex items-center justify-center text-[#1A233A] sm:hidden">
                            <Smartphone size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="hidden sm:block text-[10px] uppercase tracking-widest text-gray-400 mb-1">{t.auth.phone}</p>
                            {isEditing === 'phone' ? (
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <input className="flex-1 border-b border-[#1A233A] focus:outline-none text-sm py-1 bg-transparent" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} autoFocus />
                                  <button onClick={() => handleSaveField('phone')} className="text-emerald-600"><Check size={16}/></button>
                                </div>
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#5D6B82] cursor-pointer">
                                  <input type="checkbox" checked={otpMethod === 'sms'} onChange={() => setOtpMethod('sms')} className="accent-[#1A233A]" />
                                  {t.profile.useForCodes}
                                </label>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-[#1A233A]">{user.phone || t.profile.notConfigured}</p>
                                {otpMethod === 'sms' && <Smartphone size={12} className="text-[#C4A166]" />}
                              </div>
                            )}
                          </div>
                        </div>
                        {!isEditing && <button onClick={() => setIsEditing('phone')} className="sm:opacity-0 group-hover:opacity-100 text-[#C4A166] transition-opacity p-2"><Edit2 size={14}/></button>}
                      </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white sm:bg-transparent rounded-xl sm:rounded-none shadow-sm sm:shadow-none p-4 sm:p-0 space-y-4">
                    <button 
                      onClick={() => { setShowPaymentMethods(true); onClose(); }} 
                      className="w-full flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1A233A]/5 flex items-center justify-center text-[#1A233A]">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-left">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#5D6B82] font-bold">{t.profile.paymentMethods}</h4>
                          <p className="text-xs text-gray-600">
                            {user.paymentMethods?.length ? `${user.paymentMethods[0].brand} **** ${user.paymentMethods[0].last4}` : t.profile.noCards}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#C4A166] transition-colors" />
                    </button>
                  </div>

                {/* Business Data (for Professionals) */}
                {user.isProfessional && (
                  <div className="bg-white sm:bg-transparent rounded-xl sm:rounded-none shadow-sm sm:shadow-none p-4 sm:p-0">
                    <button 
                      onClick={() => { setShowBusinessEdit(true); onClose(); }} 
                      className="w-full flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1A233A]/5 flex items-center justify-center text-[#1A233A]">
                          <Shield size={16} />
                        </div>
                        <div className="text-left">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#5D6B82] font-bold">{t.profile.businessData}</h4>
                          <p className="text-xs text-gray-600 truncate max-w-[200px]">{user.profession || t.profile.notConfigured}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#C4A166] transition-colors" />
                    </button>
                  </div>
                )}

                {/* OTP Section */}
                {showOtp && (
                  <div className="p-4 bg-[#1A233A] text-white rounded-xl animate-fade-in shadow-xl">
                    <p className="text-xs opacity-60 mb-4">Código enviado por {otpMethod === 'email' ? 'email' : 'SMS'} (Usa 1234)</p>
                    <div className="space-y-4">
                      <input 
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-center text-xl font-bold tracking-[0.5em] focus:outline-none focus:border-[#C4A166]" 
                        value={otp} 
                        onChange={e => setOtp(e.target.value)}
                        placeholder="0000"
                        maxLength={4}
                      />
                      <Button onClick={handleVerifyOtp} className="w-full py-3">Verificar y Guardar</Button>
                    </div>
                  </div>
                )}

                {/* Role Switch Button */}
                {!isEditing && (
                  <div className="pt-2">
                      {user.isProfessional ? (
                        <button 
                          onClick={() => { 
                            navigate(currentView === 'professional-dashboard' ? 'dashboard' : 'professional-dashboard'); 
                            onClose(); 
                          }} 
                          className="w-full py-4 bg-[#1A233A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#C4A166] transition-all rounded-xl shadow-lg active:scale-[0.98]"
                        >
                          {currentView === 'professional-dashboard' ? t.profile.accessAsUser : t.profile.accessAsProfessional}
                        </button>
                      ) : (
                        <button onClick={() => { setShowProfessionalRequest(true); onClose(); }} className="w-full py-4 bg-[#1A233A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#C4A166] transition-all rounded-xl shadow-lg active:scale-[0.98]">
                          {t.profile.requestEthical}
                        </button>
                      )}
                  </div>
                )}

                {/* Legal Section */}
                {!onlyProfile && (
                <div className="bg-white sm:bg-transparent rounded-xl sm:rounded-none shadow-sm sm:shadow-none p-4 sm:p-0">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#5D6B82] mb-3 font-bold">{t.settings.legal}</h4>
                  <div className="divide-y divide-gray-50 sm:divide-none">
                      {['terms', 'privacy', 'security'].map(item => (
                          <button key={item} onClick={() => { setActiveModal(item); onClose(); }} className="w-full flex justify-between items-center py-3 sm:py-1 group">
                              <span className="text-sm text-[#1A233A] hover:text-[#C4A166] transition-colors">{t.footer[item]}</span>
                              <ChevronRight size={14} className="text-gray-300 sm:hidden" />
                          </button>
                      ))}
                  </div>
                </div>
                )}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
