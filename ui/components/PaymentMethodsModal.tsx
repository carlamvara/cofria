import React, { useState } from 'react';
import { X, CreditCard, Plus, Trash2 } from 'lucide-react';
import { theme } from '../../logic/constants';
import { Button } from './Button';
import { Input } from './Input';

interface PaymentMethodsModalProps {
  onClose: () => void;
  user: any;
  setUser: (user: any) => void;
  t: any;
}

export const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({ onClose, user, setUser, t }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const paymentMethods = user?.paymentMethods || [
    { id: 1, last4: '4242', brand: 'Visa', expiry: '12/26' }
  ];

  const handleAddCard = () => {
    const updatedMethods = [
      ...paymentMethods,
      { 
        id: Date.now(), 
        last4: newCard.number.slice(-4), 
        brand: 'Visa', // Mock brand
        expiry: newCard.expiry 
      }
    ];
    setUser({ ...user, paymentMethods: updatedMethods });
    setShowAdd(false);
    setNewCard({ number: '', expiry: '', cvc: '', name: '' });
  };

  const handleDeleteCard = (id: number) => {
    const updatedMethods = paymentMethods.filter((m: any) => m.id !== id);
    setUser({ ...user, paymentMethods: updatedMethods });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md shadow-2xl border border-[#E5E0D6] p-6 relative animate-fade-in-up rounded-xl max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10"><X size={20} /></button>
        
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <h3 className={`${theme.fontSerif} text-2xl mb-6 text-[#1A233A]`}>{t.profile.paymentMethods}</h3>
          
          {!showAdd ? (
            <div className="space-y-4">
              {paymentMethods.map((method: any) => (
                <div key={method.id} className="flex items-center justify-between p-4 border border-[#E5E0D6] rounded-lg bg-[#F7F5F0]/30">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded border border-[#E5E0D6]">
                      <CreditCard size={20} className="text-[#1A233A]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1A233A]">{method.brand} **** {method.last4}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">Expira: {method.expiry}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCard(method.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button 
                onClick={() => setShowAdd(true)}
                className="w-full py-4 border-2 border-dashed border-[#E5E0D6] rounded-lg text-[#5D6B82] hover:border-[#C4A166] hover:text-[#C4A166] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold"
              >
                <Plus size={16} /> {t.profile.addPaymentMethod}
              </button>

              <div className="pt-6">
                <Button variant="secondary" className="w-full py-3 text-xs" onClick={onClose}>Cerrar</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <Input label="Nombre en la tarjeta" value={newCard.name} onChange={e => setNewCard({...newCard, name: e.target.value})} placeholder="JUAN PEREZ" />
              <Input label="Número de tarjeta" value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Vencimiento" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} placeholder="MM/AA" />
                <Input label="CVC" value={newCard.cvc} onChange={e => setNewCard({...newCard, cvc: e.target.value})} placeholder="123" />
              </div>
              
              <div className="flex gap-2 pt-6">
                <Button variant="secondary" className="flex-1 py-3 text-xs" onClick={() => setShowAdd(false)}>Cancelar</Button>
                <Button className="flex-1 py-3 text-xs" onClick={handleAddCard}>Guardar Tarjeta</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
