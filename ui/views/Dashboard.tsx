import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, User, Clock, Shield, Edit3, Trash, Eye, Mail, Calendar, X, Copy } from 'lucide-react';
import { theme } from '../../logic/constants';
import { Message } from '../../logic/types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArchIcon } from '../components/ArchIcon';
import { EditDisabledIcon } from '../components/EditDisabledIcon';
import { maskEmail } from '../../logic/utils';
import { Toast } from '../components/Toast';

interface DashboardProps {
  t: any;
  user: any;
  navigate: (view: string) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  setEditingMessage: (msg: Message) => void;
  showReferral: boolean;
  setShowReferral: (show: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ t, user, navigate, messages, setMessages, setEditingMessage, showReferral, setShowReferral }) => {
  const [editingCustodianId, setEditingCustodianId] = useState<number | null>(null);
  const [newCustodianEmail, setNewCustodianEmail] = useState('');
  const [lastConnection, setLastConnection] = useState<Date | null>(new Date(Date.now() - 86400000 * 3)); // 3 days ago
  const [lifeSignalStatus, setLifeSignalStatus] = useState<'idle' | 'saved'>('idle');
  const [viewingStatusMsg, setViewingStatusMsg] = useState<Message | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const handleSaveCustodian = () => {
    setMessages(messages.map(m => m.id === editingCustodianId ? { ...m, custodianEmail: newCustodianEmail, custodianAccepted: false, lastAction: 'Custodio actualizado.' } : m));
    setEditingCustodianId(null);
  };

  const handleLifeSignal = () => {
    setLastConnection(new Date());
    setLifeSignalStatus('saved');
    setTimeout(() => setLifeSignalStatus('idle'), 2000);
  };

  const handleEdit = (msg: Message) => {
    setEditingMessage(msg);
    navigate('create');
  };

  const getStatusDescription = (msg: Message) => {
    if (msg.status === 'draft') return t.statusMessages.draftStatus;
    if (msg.type === 'direct') {
       return `${t.statusMessages.sealedDirect} ${msg.openingDate || t.statusMessages.datePending}`;
    }
    if (msg.type === 'custody') {
        if (!msg.custodianAccepted) return t.statusMessages.waitingCustodian;
        return t.statusMessages.custodianConfirmed;
    }
    return msg.lastAction;
  };

  return (
    <div className={`min-h-screen py-8 md:py-16 px-4 md:px-12 ${theme.bg}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl animate-fade-in-up border border-[#E5E0D6] text-center relative">
            <button onClick={() => setShowReferral(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
            <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C4A166]">
              <Mail size={32} />
            </div>
            <h3 className={`${theme.fontSerif} text-2xl mb-4 text-[#1A233A]`}>Recomendar COFRIA</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{t.referral.share}</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 mb-8">
              <input 
                type="text" 
                readOnly 
                value={`https://cofria.com/ref/${user?.id || 'user'}`} 
                className="bg-transparent text-xs text-gray-600 w-full px-2 focus:outline-none"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://cofria.com/ref/${user?.id || 'user'}`);
                  setToast({ message: 'Link copiado al portapapeles', type: 'success' });
                }}
                className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
              >
                <Copy size={14} className="text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-8">
              {user?.role === 'professional' 
                ? 'Tendrás un mensaje gratis al año si alguna de las personas que recomiendas sella un mensaje. ¡Motiva a otros a decir lo importante!'
                : 'Recibirás hasta 10 mensajes gratis al año cuando tus amigos sellen su primer mensaje. ¡Motiva a otros a decir lo importante!'}
            </p>
          </div>
        </div>
      )}
      {viewingStatusMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setViewingStatusMsg(null)}>
          <div className="bg-white p-8 rounded-xl max-w-sm w-full shadow-2xl animate-fade-in-up border border-[#E5E0D6]" onClick={e => e.stopPropagation()}>
            <h3 className={`${theme.fontSerif} text-xl mb-4 text-[#1A233A]`}>{t.dashboard.statusTitle}</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{getStatusDescription(viewingStatusMsg)}</p>
            <Button onClick={() => setViewingStatusMsg(null)} className="w-full">Cerrar</Button>
          </div>
        </div>
      )}
      {editingCustodianId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl animate-fade-in">
            <h3 className={`${theme.fontSerif} text-2xl mb-4 text-[#1A233A]`}>{t.dashboard.actions.changeCustodian}</h3>
            <Input label={t.editor.custodian} value={newCustodianEmail} onChange={e => setNewCustodianEmail(e.target.value)} placeholder="nuevo.custodio@email.com" icon={<User size={14}/>} />
            <div className="flex gap-4 mt-6">
              <Button variant="secondary" className="w-full" onClick={() => setEditingCustodianId(null)}>{t.editor.backBtn}</Button>
              <Button className="w-full" onClick={handleSaveCustodian}>{t.editor.sealBtn}</Button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-12 gap-4 md:gap-8">
          <div className="w-full lg:w-auto">
            <div className="flex items-center justify-between md:block">
                <h2 className={`${theme.fontSerif} text-2xl md:text-6xl text-[#1A233A] md:mb-6`}>{t.dashboard.title}</h2>
                <div className="md:hidden">
                    <button 
                        onClick={handleLifeSignal}
                        className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all flex items-center gap-2 border px-4 py-2 rounded-full ${lifeSignalStatus === 'saved' ? 'bg-green-100 text-green-700 border-green-200' : 'text-[#C4A166] border-[#C4A166]/30 hover:border-[#1A233A] hover:text-[#1A233A]'}`}
                    >
                        {lifeSignalStatus === 'saved' ? <CheckCircle size={12} /> : <ShieldCheck size={12} />}
                        {lifeSignalStatus === 'saved' ? t.dashboard.lifeSignalSuccess : t.dashboard.lifeSignal}
                    </button>
                </div>
            </div>
            
            <div className="hidden md:flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5D6B82] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                {t.dashboard.lastConnection}: {lastConnection ? `${lastConnection.toLocaleDateString()} ${lastConnection.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : '...'}
              </div>
              <span className="hidden sm:block text-gray-300">|</span>
              <button 
                onClick={handleLifeSignal}
                className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all flex items-center gap-2 border px-4 py-2 rounded-full ${lifeSignalStatus === 'saved' ? 'bg-green-100 text-green-700 border-green-200' : 'text-[#C4A166] border-[#C4A166]/30 hover:border-[#1A233A] hover:text-[#1A233A]'}`}
              >
                {lifeSignalStatus === 'saved' ? <CheckCircle size={12} /> : <ShieldCheck size={12} />}
                {lifeSignalStatus === 'saved' ? t.dashboard.lifeSignalSuccess : t.dashboard.lifeSignal}
              </button>
            </div>
          </div>
          <Button onClick={() => navigate('create')} className="text-xs py-4 px-8 tracking-[0.2em] shadow-xl w-full sm:w-auto mt-4 md:mt-0">+ {t.nav.create}</Button>
        </div>

        <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-6 pb-0 lg:pb-12 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-24 -mx-4 px-4 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
          {messages.map(msg => {
            const isEditable = msg.status === 'draft' || msg.remainingEdits > 0;
            const displayStatusLabel = msg.status === 'draft' ? t.dashboard.status.draft : t.dashboard.status.sealed;
            
            return (
              <div 
                key={msg.id} 
                className="group bg-white pt-8 pb-0 px-0 md:pt-16 border border-[#E5E0D6] flex flex-col shadow-sm hover:shadow-2xl transition-all duration-1000 rounded-tr-[80px] md:rounded-tr-[140px] rounded-tl-2xl rounded-bl-2xl rounded-br-2xl relative overflow-hidden min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center shrink-0"
              >
                {/* Decorative Arch Ribbon */}
                <div className="absolute top-0 left-0 w-full h-[8px] bg-[#1A233A] group-hover:bg-[#C4A166] transition-colors duration-700"></div>
                
                <div className="px-6 pb-6 md:px-10 md:pb-12 flex-grow flex flex-col">
                  
                  {/* Top Header Section (Type Icon + Status Badge aligned horizontally to the left) */}
                  <div className="flex items-center gap-4 mb-6 md:mb-10">
                    <div className={`p-4 rounded-full ${msg.status === 'draft' ? 'bg-gray-50 text-gray-300' : 'bg-[#F7F5F0] text-[#1A233A]'} shadow-inner border border-[#E5E0D6]/20 transform group-hover:scale-110 transition-all duration-700`}>
                      {msg.type === 'direct' ? <Clock size={24} /> : <Shield size={24} />}
                    </div>

                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full transition-all duration-700 ${msg.status !== 'draft' ? 'bg-[#C4A166] text-white shadow-xl shadow-gold/20' : 'bg-gray-100 text-gray-400'}`}>
                      {displayStatusLabel}
                    </span>
                  </div>

                  {/* Title Block (Title Left + Actions Right) */}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-serif text-2xl md:text-4xl leading-tight ${msg.status === 'draft' ? 'text-gray-300 italic font-light' : 'text-[#1A233A]'}`}>
                      {msg.title || 'In Nomine...'}
                    </h4>
                    
                    {/* Action Icons - Same line as title, right aligned */}
                    <div className="flex items-center gap-6 pt-2">
                      <button 
                        disabled={!isEditable}
                        title={isEditable ? "Editar" : "Edición no disponible"}
                        onClick={(e) => { e.stopPropagation(); handleEdit(msg); }}
                        className={`transition-all duration-500 transform hover:scale-125 ${isEditable ? 'text-[#C4A166]' : 'text-gray-200 opacity-20 cursor-not-allowed'}`}
                      >
                        {isEditable ? <Edit3 size={20} /> : <EditDisabledIcon />}
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (window.confirm(t.dashboard.deleteConfirm)) {
                            setMessages(messages.filter(m => m.id !== msg.id)); 
                          }
                        }} 
                        title="Eliminar"
                        className="transition-all duration-500 transform hover:scale-125 text-[#1A233A]/20 hover:text-red-700"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Subtitle (Type) */}
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#C4A166] font-black mb-4">
                      {msg.type === 'direct' ? t.editor.types.direct : t.editor.types.custody}
                  </p>
                  
                  {/* Metadata Grid (Simplified, duplicate Type removed) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-8 gap-x-12 border-t border-[#F7F5F0] pt-4 md:pt-10">
                     <div className="flex flex-col gap-2">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#C4A166] font-black">{t.dashboard.meta.recipient}</p>
                        <p className="text-sm font-medium text-[#1A233A] tracking-tight flex items-center gap-2">
                          <Mail size={14} className="opacity-20" /> {maskEmail(msg.recipient)}
                        </p>
                     </div>

                     {msg.sealingDate && (
                        <div className="flex flex-col gap-2">
                           <p className="text-[9px] uppercase tracking-[0.2em] text-[#C4A166] font-black">{t.dashboard.meta.sealedDate}</p>
                           <p className="text-sm font-medium text-[#1A233A] flex items-center gap-2">
                             <Calendar size={14} className="opacity-20" /> {msg.sealingDate}
                           </p>
                        </div>
                     )}
                     
                     {msg.type === 'direct' && msg.openingDate && (
                        <div className="flex flex-col gap-2">
                           <p className="text-[9px] uppercase tracking-[0.2em] text-[#C4A166] font-black">{t.dashboard.meta.opening}</p>
                           <p className="text-sm font-medium text-[#1A233A] flex items-center gap-2">
                             <Clock size={14} className="opacity-20" /> {msg.openingDate}
                           </p>
                        </div>
                     )}

                     {msg.type === 'custody' && (
                        <div className="flex flex-col gap-2">
                           <p className="text-[9px] uppercase tracking-[0.2em] text-[#C4A166] font-black">{t.dashboard.meta.custodian}</p>
                           <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${msg.custodianAccepted ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-amber-400 animate-pulse'}`}></div>
                              <p className="text-xs font-black text-[#1A233A] uppercase tracking-widest">
                                 {msg.custodianAccepted ? t.dashboard.meta.yes : t.dashboard.meta.waiting}
                              </p>
                              <button onClick={() => { setEditingCustodianId(msg.id); setNewCustodianEmail(msg.custodianEmail || ''); }} className="ml-2 text-[9px] underline text-[#5D6B82] hover:text-[#1A233A] uppercase tracking-widest font-bold">
                                {t.dashboard.actions.changeCustodian}
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
                </div>

                {/* Integrated Main Action Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setViewingStatusMsg(msg); }}
                  className="w-full text-[11px] uppercase tracking-[0.4em] font-black py-7 bg-[#1A233A] text-white hover:bg-[#C4A166] transition-all duration-700 flex items-center justify-center gap-4 group/btn"
                >
                  <Eye size={18} className="group-hover/btn:translate-x-1 transition-transform" /> {t.dashboard.actions.view}
                </button>
              </div>
            );
          })}
          
          {messages.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-52 bg-white/40 rounded-[80px] border-2 border-dashed border-[#E5E0D6]">
               <ArchIcon className="w-24 h-24 mb-8 text-[#E5E0D6] opacity-30" />
               <p className="uppercase text-[10px] font-black tracking-[0.6em] text-[#E5E0D6]">{t.dashboard.empty}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
