import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, User, Clock, Shield, Mic, Video, Image as ImageIcon, X, CreditCard, Lock, AlertTriangle, Globe, Sparkles, Mail, Copy } from 'lucide-react';
import { theme } from '../../logic/constants';
import { Message } from '../../logic/types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MediaDrawer } from '../components/MediaDrawer';
import { WaxSealIcon } from '../components/WaxSealIcon';
import { calculateRegionalPrice } from '../../logic/utils';
import { LoginRegister } from './LoginRegister';

interface CreateMessageProps {
  t: any;
  lang: string;
  user: any;
  setUser: (user: any) => void;
  navigate: (view: string) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  editingMessage: Message | null;
  setEditingMessage: (msg: Message | null) => void;
  setShowReferral: (show: boolean) => void;
  showReferral: boolean;
}

export const CreateMessage: React.FC<CreateMessageProps> = ({ t, lang, user, setUser, navigate, messages, setMessages, editingMessage, setEditingMessage, setShowReferral, showReferral }) => {
  const [step, setStep] = useState(1);
  const [msgTitle, setMsgTitle] = useState(editingMessage?.title || '');
  const [content, setContent] = useState(editingMessage?.content || '');
  const [type, setType] = useState<'direct' | 'custody'>(editingMessage?.type || 'direct');
  const [recipientName, setRecipientName] = useState(editingMessage?.recipientName || '');
  const [recipientEmail, setRecipientEmail] = useState(editingMessage?.recipient || '');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [saveCard, setSaveCard] = useState(false);
  const [date, setDate] = useState(editingMessage?.openingDate || '');
  const [custodianName, setCustodianName] = useState(editingMessage?.custodianName || '');
  const [custodianEmail, setCustodianEmail] = useState(editingMessage?.custodianEmail || '');
  const [attachment, setAttachment] = useState<string | undefined>(editingMessage?.attachment);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [isMediaDrawerOpen, setMediaDrawerOpen] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'seal' | 'draft' | null>(null);

  React.useEffect(() => {
    if (user && pendingAction) {
      if (pendingAction === 'seal') {
        handleSeal();
      } else if (pendingAction === 'draft') {
        handleSaveDraft();
      }
      setPendingAction(null);
    }
  }, [user, pendingAction]);

  React.useEffect(() => {
    if (user?.paymentMethods && user.paymentMethods.length > 0 && !selectedCard) {
      setSelectedCard(user.paymentMethods[0].id);
    }
  }, [user, selectedCard]);

  const openMedia = (type: string) => {
    // If there is already an attachment, confirm replacement
    if (attachment) {
      if (!window.confirm('Solo puedes adjuntar un archivo multimedia por mensaje. ¿Deseas reemplazar el archivo actual?')) {
        return;
      }
    }
    setMediaType(type);
    setMediaDrawerOpen(true);
  };

  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvc: '' });
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);

  const handleSeal = () => {
    if (!user) {
      setPendingAction('seal');
      setShowLoginModal(true);
      return;
    }
    
    if (editingMessage && editingMessage.status === 'sealed') {
      // If editing a sealed message, save changes directly without payment
      const updatedMessages = messages.map(m => 
        m.id === editingMessage.id 
          ? { ...m, title: msgTitle, content, recipient: recipientEmail, type, openingDate: date, custodianName: custodianName, custodianEmail: custodianEmail, attachment, remainingEdits: m.remainingEdits - 1, lastAction: 'Mensaje editado.' }
          : m
      );
      setMessages(updatedMessages);
      setEditingMessage(null);
      navigate('dashboard');
    } else {
      setShowPayment(true);
    }
  };

  const processPayment = () => {
    setIsProcessingPayment(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPayment(false);
      
      if (editingMessage && editingMessage.status === 'draft') {
          // Update existing draft to sealed
          const updatedMessages = messages.map(m => 
            m.id === editingMessage.id 
              ? { 
                  ...m, 
                  status: 'sealed', 
                  title: msgTitle || 'In Nomine...', 
                  content, 
                  attachment, 
                  sealingDate: new Date().toLocaleDateString(), 
                  openingDate: date,
                  recipientName,
                  recipient: recipientEmail,
                  custodianName: type === 'custody' ? custodianName : undefined,
                  custodianEmail: type === 'custody' ? custodianEmail : undefined,
                  custodianAccepted: false,
                  lastAction: 'Mensaje sellado y encriptado.',
                  remainingEdits: 1
                }
              : m
          );
          setMessages(updatedMessages);
      } else {
          // Create new sealed message
          const newMessage: Message = { 
            id: Date.now(), 
            type: type as any, 
            recipientName,
            recipient: recipientEmail,
            status: 'sealed', 
            title: msgTitle || 'In Nomine...', 
            content, 
            attachment, 
            sealingDate: new Date().toLocaleDateString(), 
            openingDate: date,
            hasCustodian: type === 'custody',
            custodianName: type === 'custody' ? custodianName : undefined,
            custodianEmail: type === 'custody' ? custodianEmail : undefined,
            custodianAccepted: type === 'custody' ? false : undefined,
            lastAction: 'Mensaje sellado y encriptado.',
            remainingEdits: 1 // Grant 1 edit after payment
          };
          setMessages([...messages, newMessage]);
          
          // Show referral prompt after sealing a new message
          setShowReferral(true);
      }
      setStep(5);
    }, 2000);
  };

  const [showDraftWarning, setShowDraftWarning] = useState(false);
  const [showOccasionsModal, setShowOccasionsModal] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState<number | null>(null);
  const [hoveredOccasion, setHoveredOccasion] = useState<number | null>(null);

  React.useEffect(() => {
    if (!showOccasionsModal) {
      setActiveOccasion(null);
      setHoveredOccasion(null);
    }
  }, [showOccasionsModal]);

  const handleSaveDraft = () => { 
    if (!user) {
      setPendingAction('draft');
      setShowLoginModal(true);
      return;
    }

    // Warn if attachment exists that it won't be saved
    if (attachment) {
      setShowDraftWarning(true);
      return;
    }
    proceedSaveDraft();
  };

  const proceedSaveDraft = () => {
    if (editingMessage) {
        // Update existing draft
        const updatedMessages = messages.map(m => 
            m.id === editingMessage.id 
              ? { ...m, title: msgTitle, content, recipientName, recipient: recipientEmail, type, openingDate: date, custodianName: type === 'custody' ? custodianName : undefined, custodianEmail: type === 'custody' ? custodianEmail : undefined, attachment: undefined, lastAction: 'Borrador actualizado.' }
              : m
          );
          setMessages(updatedMessages);
    } else {
        // Create new draft
        const draftMessage: Message = { 
        id: Date.now(), 
        type: type as any, 
        recipientName,
        recipient: recipientEmail,
        status: 'draft', 
        title: msgTitle || 'Sin título', 
        content, 
        attachment: undefined, // Do not save attachment in draft
        sealingDate: undefined, 
        openingDate: date,
        hasCustodian: type === 'custody',
        custodianName: type === 'custody' ? custodianName : undefined,
        custodianEmail: type === 'custody' ? custodianEmail : undefined,
        custodianAccepted: false,
        lastAction: 'Borrador guardado.',
        remainingEdits: 0
        };
        setMessages([...messages, draftMessage]);
    }
    setEditingMessage(null);
    navigate('home');
  };

  if (step === 5) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme.bg} text-center px-6 animate-fade-in`}>
        <div className="w-20 h-20 bg-[#1A233A] rounded-full flex items-center justify-center mb-8 shadow-2xl">
          <ShieldCheck className="text-[#C4A166] w-10 h-10" />
        </div>
        <h2 className={`${theme.fontSerif} text-4xl md:text-5xl text-[#1A233A] mb-6`}>{t.editor.successTitle}</h2>
        <p className="text-gray-600 max-w-md mb-8 leading-relaxed">{t.editor.successBody}</p>
        
        <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
          <Button onClick={() => { setShowReferral(true); setStep(1); setMsgTitle(''); setContent(''); }} className="w-full">Redactar otro mensaje</Button>
          <Button variant="secondary" onClick={() => { setShowReferral(true); navigate('dashboard'); }} className="w-full">Regresar a Mi Cofre</Button>
        </div>
      </div>
    );
  }

  // Calculate price based on user country (simulated)
  const userCountry = user?.country || 'US';
  const price = calculateRegionalPrice(userCountry, lang, type === 'direct' ? 15 : 35);

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col`}>
      {/* Occasions Modal */}
      {showOccasionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#F7F5F0] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E5E0D6] p-10 relative animate-fade-in-up">
            <button onClick={() => setShowOccasionsModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
            <div className="text-center mb-8">
              <h3 className={`${theme.fontSerif} text-3xl text-[#1A233A] mb-4`}>Momentos para recordar</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Descubre la belleza de compartir un mensaje en el momento justo.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-[#1A233A] font-serif">
              {[
                { title: 'Cumpleaños', desc: 'Celebra la vida y el camino recorrido con gratitud.' },
                { title: 'Aniversario', desc: 'Honra el tiempo compartido y la historia que siguen construyendo.' },
                { title: 'Graduación', desc: 'Reconoce el esfuerzo y el inicio de un nuevo capítulo lleno de posibilidades.' },
                { title: 'Viaje largo', desc: 'Despídete con amor y buenos deseos para la aventura que comienza.' },
                { title: 'Logros', desc: 'Celebra la dedicación y el éxito alcanzado con orgullo.' },
                { title: 'Enfermedad', desc: 'Ofrece consuelo, fuerza y compañía en los momentos de vulnerabilidad.' },
                { title: 'Bodas', desc: 'Bendice esta unión y el futuro que emprenden juntos.' },
                { title: 'Reconciliaciones', desc: 'Tiende puentes con sinceridad y apertura al perdón.' },
                { title: 'Hijos', desc: 'Expresa el amor incondicional y los deseos para su crecimiento.' },
                { title: 'Cuando el momento sea correcto', desc: 'Un mensaje para el futuro, cuando las palabras sean necesarias.' }
              ].map((occasion, i) => {
                const isActive = activeOccasion === i;
                const isHovered = hoveredOccasion === i;
                const showDesc = isActive || isHovered;
                return (
                  <div 
                    key={i} 
                    className={`p-3 border border-[#E5E0D6] bg-white/50 rounded-lg text-center transition-all duration-300 relative cursor-pointer min-h-[60px] flex items-center justify-center ${showDesc ? 'border-[#C4A166] bg-white shadow-sm' : 'hover:bg-white'}`}
                    onMouseEnter={() => setHoveredOccasion(i)}
                    onMouseLeave={() => setHoveredOccasion(null)}
                    onClick={() => setActiveOccasion(isActive ? null : i)}
                  >
                    <span className={`${showDesc ? 'hidden' : 'block'} font-medium`}>{occasion.title}</span>
                    <span className={`${showDesc ? 'block' : 'hidden'} text-xs text-[#C4A166] leading-tight font-medium`}>{occasion.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Draft Warning Modal */}
      {showDraftWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E0D6] p-8 relative animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-amber-600 w-6 h-6" />
              </div>
              <h3 className={`${theme.fontSerif} text-xl text-[#1A233A] mb-2`}>Aviso Importante</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Los archivos multimedia adjuntos no se guardan en borradores por seguridad. Solo se encriptan y almacenan al sellar el mensaje.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setShowDraftWarning(false)} className="flex-1">Cancelar</Button>
              <Button onClick={() => { setShowDraftWarning(false); proceedSaveDraft(); }} className="flex-1">Guardar sin adjunto</Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E0D6] p-8 relative animate-fade-in-up">
            <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-[#1A233A] rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-[#C4A166] w-6 h-6" />
              </div>
              <h3 className={`${theme.fontSerif} text-2xl text-[#1A233A]`}>{t.editor.paymentTitle}</h3>
              <p className="text-sm text-gray-500 mt-2">{t.editor.paymentDesc.replace('$10 USD', price)}</p>
            </div>

            <div className="space-y-4 mb-8">
              {user?.paymentMethods && user.paymentMethods.length > 0 && !isAddingNewCard ? (
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Tarjeta guardada</label>
                  {user.paymentMethods.map((card: any) => (
                    <div 
                      key={card.id}
                      onClick={() => setSelectedCard(card.id)}
                      className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition-colors ${selectedCard === card.id || (!selectedCard && user.paymentMethods[0].id === card.id) ? 'border-[#C4A166] bg-[#C4A166]/5' : 'border-gray-200 hover:border-[#C4A166]/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className={selectedCard === card.id || (!selectedCard && user.paymentMethods[0].id === card.id) ? 'text-[#C4A166]' : 'text-gray-400'} />
                        <div>
                          <p className="font-medium text-sm text-[#1A233A]">{card.brand} terminada en {card.last4}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedCard === card.id || (!selectedCard && user.paymentMethods[0].id === card.id) ? 'border-[#C4A166]' : 'border-gray-300'}`}>
                        {(selectedCard === card.id || (!selectedCard && user.paymentMethods[0].id === card.id)) && <div className="w-2 h-2 bg-[#C4A166] rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setIsAddingNewCard(true)} className="text-sm text-[#C4A166] hover:text-[#1A233A] underline underline-offset-4 w-full text-center mt-4 font-bold">
                    AGREGAR TARJETA
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input label={t.editor.cardHolder} value={paymentData.cardHolder} onChange={e => setPaymentData({...paymentData, cardHolder: e.target.value})} placeholder="Ej: Juan Pérez" icon={<User size={14}/>} />
                  <Input label={t.editor.cardNumber} value={paymentData.cardNumber} onChange={e => setPaymentData({...paymentData, cardNumber: e.target.value})} placeholder="0000 0000 0000 0000" icon={<CreditCard size={14}/>} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label={t.editor.expiry} value={paymentData.expiry} onChange={e => setPaymentData({...paymentData, expiry: e.target.value})} placeholder={t.editor.expiryFormat} />
                    <Input label={t.editor.cvc} value={paymentData.cvc} onChange={e => setPaymentData({...paymentData, cvc: e.target.value})} placeholder="123" />
                  </div>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} />
                    Guardar tarjeta para futuros mensajes
                  </label>
                  {user?.paymentMethods && user.paymentMethods.length > 0 && (
                    <button onClick={() => setIsAddingNewCard(false)} className="text-sm text-gray-500 hover:text-black underline underline-offset-4 w-full text-center mt-2 font-bold">
                      USAR TARJETA GUARDADA
                    </button>
                  )}
                </div>
              )}
            </div>

            <Button className="w-full py-4 text-lg shadow-lg" onClick={processPayment} disabled={isProcessingPayment}>
              {isProcessingPayment ? t.editor.processing : (isAddingNewCard ? `AGREGAR TARJETA Y PAGAR (${price})` : `${t.editor.payBtn} (${price})`)}
            </Button>
            
            <div className="mt-4 flex justify-center gap-4 text-gray-300">
               <Lock size={12} /> <span className="text-[10px] uppercase tracking-widest">{t.editor.securePayment}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full p-6 md:p-12">
        {step < 5 && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <h2 className={`${theme.fontSerif} text-3xl md:text-4xl text-[#1A233A]`}>{editingMessage ? t.editor.editTitle : t.editor.title}</h2>
            <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest">
              <span className={step >= 1 ? "font-bold opacity-100" : "opacity-30"}>{t.editor.step1}</span>
              <span className={step >= 2 ? "font-bold opacity-100" : "opacity-30"}>{t.editor.step2}</span>
              <span className={step >= 3 ? "font-bold opacity-100" : "opacity-30"}>{t.editor.step3}</span>
              <span className={step >= 4 ? "font-bold opacity-100" : "opacity-30"}>{t.editor.step4}</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in relative"><div className="bg-white p-8 border border-[#E5E0D6] shadow-sm min-h-[400px] flex flex-col relative overflow-hidden"><Input label={t.editor.msgTitle} value={msgTitle} onChange={e => setMsgTitle(e.target.value)} placeholder="Ej: Para tus 30s" className="mb-4 font-serif text-xl" /><textarea className={`w-full flex-grow resize-none focus:outline-none text-lg ${theme.fontSerif} leading-relaxed bg-transparent`} placeholder={t.editor.placeholder} value={content} onChange={e => setContent(e.target.value)} />{attachment && (<div className="mt-4 mb-16 p-3 bg-[#F7F5F0] border border-[#E5E0D6] rounded flex items-center justify-between"><div className="flex items-center gap-3"><Sparkles size={16} className="text-[#C4A166]" /><span className="text-sm font-medium">{attachment}</span></div><button onClick={() => setAttachment(undefined)} className="text-red-400 hover:text-red-600"><X size={16} /></button></div>)}<div className="absolute bottom-0 left-0 right-0 px-8 py-4 border-t border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-sm"><div className="flex gap-4"><button onClick={() => openMedia('image')} className="text-gray-400 hover:text-[#1A233A] transition-colors group"><ImageIcon size={20} /></button><button onClick={() => openMedia('audio')} className="text-gray-400 hover:text-[#1A233A] transition-colors group"><Mic size={20} /></button><button onClick={() => openMedia('video')} className="text-gray-400 hover:text-[#1A233A] transition-colors group"><Video size={20} /></button></div><button onClick={handleSaveDraft} className="text-xs uppercase tracking-widest opacity-40 hover:opacity-100 font-bold">{t.editor.draftBtn}</button></div><MediaDrawer isOpen={isMediaDrawerOpen} type={mediaType || ''} onClose={() => setMediaDrawerOpen(false)} onSave={(file) => setAttachment(file)} t={t.editor.media} /></div><div className="flex justify-between items-center mt-8"><button onClick={() => setShowOccasionsModal(true)} className="text-xs text-[#C4A166] hover:text-[#1A233A] transition-colors underline underline-offset-4">¿Necesitas ideas sobre el momento oportuno para enviar tu mensaje?</button><Button onClick={() => setStep(2)}>{t.editor.nextBtn}</Button></div></div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-white p-8 border border-[#E5E0D6] shadow-sm space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-sm mb-4">1. Destinatario</h4>
              <Input label="Nombre del destinatario" value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Ej: Sarah" icon={<User size={14}/>} />
              <Input label="Email del destinatario" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder="ejemplo@email.com" icon={<Mail size={14}/>} />
            </div>

            <div className="bg-white p-8 border border-[#E5E0D6] shadow-sm space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-sm mb-4">2. Método de entrega</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setType('direct')} className={`p-4 border text-left transition-all ${type === 'direct' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  <h5 className="font-bold text-sm">Fecha específica</h5>
                  <p className="text-xs text-gray-600 my-1">El mensaje será entregado en la fecha exacta que programes.</p>
                  <p className="text-xs font-bold">{calculateRegionalPrice(userCountry, lang, 15)}</p>
                </button>
                <button onClick={() => setType('custody')} className={`p-4 border text-left transition-all ${type === 'custody' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  <h5 className="font-bold text-sm">Custodiado</h5>
                  <p className="text-xs text-gray-600 my-1">Designa a una persona de confianza para que libere tu mensaje cuando sea el momento oportuno.</p>
                  <p className="text-xs font-bold">{calculateRegionalPrice(userCountry, lang, 35)}</p>
                </button>
              </div>

              {type === 'direct' ? (
                <Input label="Fecha de entrega" type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} icon={<Clock size={14}/>} />
              ) : (
                <div className="space-y-4">
                  <Input label="Nombre del custodio" value={custodianName} onChange={e => setCustodianName(e.target.value)} placeholder="Ej: Juan" icon={<User size={14}/>} />
                  <Input label="Email del custodio" value={custodianEmail} onChange={e => setCustodianEmail(e.target.value)} placeholder="custodio@email.com" icon={<Mail size={14}/>} />
                  <p className="text-xs text-gray-500 italic">Nota: Contactaremos a tu custodio para confirmar su aceptación. Si declina la responsabilidad, podrás asignar a otra persona.</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => setStep(1)} className="text-xs uppercase tracking-widest opacity-40 font-bold hover:opacity-100">{t.editor.backBtn}</button>
              <Button onClick={() => setStep(3)}>{t.editor.nextBtn}</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in max-w-md mx-auto text-center space-y-12 py-10">
            <div className="relative inline-block"><WaxSealIcon className={`w-32 h-32 ${isSealing ? 'animate-pulse text-[#C4A166]' : 'text-[#8B0000]'} transition-colors duration-1000`} />{isSealing && <div className="absolute inset-0 bg-white/20 animate-ping rounded-full"></div>}</div>
            

            <div className="space-y-4"><h3 className={`${theme.fontSerif} text-2xl uppercase tracking-widest text-[#1A233A]`}>{t.editor.sealBtn}</h3><div className="p-4 bg-amber-50 border border-amber-200 rounded flex gap-3 text-left"><AlertTriangle size={18} className="text-amber-600 shrink-0" /><p className="text-xs text-amber-800 leading-relaxed font-medium">{t.editor.sealWarning}</p></div></div><div className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-4 py-2 border-t border-gray-100 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t.editor.total}</span>
                <span className="text-lg font-serif text-[#1A233A]">{price}</span>
              </div>
              <Button className="w-full button-magical" disabled={isSealing} onClick={handleSeal}>{isSealing ? 'Sellar...' : t.editor.sealBtn}</Button>
              <button onClick={() => setStep(2)} className="text-[10px] uppercase tracking-widest opacity-40 font-bold hover:opacity-100">{t.editor.backBtn}</button>
            </div>
          </div>
        )}

        {showReferral && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl animate-fade-in-up border border-[#E5E0D6] text-center relative">
              <button onClick={() => setShowReferral(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
              <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C4A166]">
                <Mail size={32} />
              </div>
              <h3 className={`${theme.fontSerif} text-2xl mb-4 text-[#1A233A]`}>Recomienda COFRIA</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{t.referral.share}</p>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 mb-4">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://cofria.com/ref/${user?.id || 'user'}`} 
                  className="bg-transparent text-xs text-gray-600 w-full px-2 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`https://cofria.com/ref/${user?.id || 'user'}`);
                    alert('Link copiado al portapapeles');
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

        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="relative max-w-md w-full my-8">
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  setPendingAction(null);
                }} 
                className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
              >
                <X size={24} />
              </button>
              <LoginRegister 
                t={t} 
                setUser={setUser} 
                navigate={navigate} 
                isModal={true} 
                onSuccess={() => {
                  setShowLoginModal(false);
                  // The useEffect will handle the pendingAction once user is updated
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
