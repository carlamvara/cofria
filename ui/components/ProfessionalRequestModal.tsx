import React, { useState } from 'react';
import { X } from 'lucide-react';
import { theme, PROFESSIONS } from '../../logic/constants';
import { Button } from './Button';
import { Input } from './Input';

interface ProfessionalRequestModalProps {
  onClose: () => void;
  user: any;
  setUser: (user: any) => void;
  t: any;
}

export const ProfessionalRequestModal: React.FC<ProfessionalRequestModalProps> = ({ onClose, user, setUser, t }) => {
  const [ethicalData, setEthicalData] = useState({ 
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

  const handleSubmitEthical = () => {
    if (user) {
      const finalProfession = (ethicalData.profession === 'health' || ethicalData.profession === 'other') 
        ? ethicalData.customProfession 
        : PROFESSIONS.find(p => p.id === ethicalData.profession)?.name || ethicalData.profession;

      setUser({ 
        ...user, 
        ...ethicalData, 
        profession: finalProfession,
        isEthicalProfessional: true, 
        isProfessional: true,
        isPublic: true, // Default to visible
        publicEmail: user.email, // Default to account email
        bio: '', // Initial empty bio
        photoUrl: '', // Initial empty photo
        referralCount: 0,
        annualMessageUsed: false
      });
      alert('Solicitud enviada con éxito. Ahora tienes acceso profesional.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md shadow-2xl border border-[#E5E0D6] p-6 relative animate-fade-in-up rounded-xl max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10"><X size={20} /></button>
        
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <h3 className={`${theme.fontSerif} text-2xl mb-2 text-[#1A233A]`}>{t.profile.ethicalTitle}</h3>
          <p className="text-xs text-gray-500 mb-6">{t.profile.ethicalDesc}</p>
          
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-xs uppercase tracking-widest text-[#5D6B82] mb-2">{t.profile.profession}</label>
              <select 
                className={`w-full bg-white border ${theme.border} p-3 text-base focus:outline-none focus:border-[#1A233A] transition-colors`} 
                value={ethicalData.profession} 
                onChange={e => setEthicalData({...ethicalData, profession: e.target.value})}
              >
                <option value="">Seleccionar profesión</option>
                {PROFESSIONS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {(ethicalData.profession === 'health' || ethicalData.profession === 'other') && (
              <Input 
                label="Especificar profesión" 
                value={ethicalData.customProfession} 
                onChange={e => setEthicalData({...ethicalData, customProfession: e.target.value})} 
                placeholder="Ej: Nutricionista, Mediador..." 
              />
            )}

            <Input label={t.profile.license + " (opcional)"} value={ethicalData.licenseNumber} onChange={e => setEthicalData({...ethicalData, licenseNumber: e.target.value})} placeholder="Nº Matrícula" />
            <Input label="Dirección del Consultorio/Negocio (opcional)" value={ethicalData.businessAddress} onChange={e => setEthicalData({...ethicalData, businessAddress: e.target.value})} placeholder="Calle, Ciudad, CP" />
            <Input label="Teléfono del Consultorio (opcional)" value={ethicalData.businessPhone} onChange={e => setEthicalData({...ethicalData, businessPhone: e.target.value})} placeholder="+34..." />
            <Input label="Web (opcional)" value={ethicalData.webLinks} onChange={e => setEthicalData({...ethicalData, webLinks: e.target.value})} placeholder="https://..." />
            <Input label="LinkedIn (opcional)" value={ethicalData.socialMedia} onChange={e => setEthicalData({...ethicalData, socialMedia: e.target.value})} placeholder="https://linkedin.com/in/..." />
            <Input label="Instagram (opcional)" value={ethicalData.instagram} onChange={e => setEthicalData({...ethicalData, instagram: e.target.value})} placeholder="@usuario" />
            <Input label="Facebook (opcional)" value={ethicalData.facebook} onChange={e => setEthicalData({...ethicalData, facebook: e.target.value})} placeholder="facebook.com/..." />
            <Input label="Cantidad de pacientes/clientes (Opcional)" value={ethicalData.patientCount} onChange={e => setEthicalData({...ethicalData, patientCount: e.target.value})} placeholder="Ej: 50" />

            <div className="flex gap-2 pt-6 pb-2">
              <Button variant="secondary" className="flex-1 py-3 text-xs" onClick={onClose}>Cancelar</Button>
              <Button 
                className="flex-1 py-3 text-xs" 
                onClick={handleSubmitEthical} 
                disabled={!ethicalData.profession || ((ethicalData.profession === 'health' || ethicalData.profession === 'other') && !ethicalData.customProfession)}
              >
                {t.profile.submitEthical}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
