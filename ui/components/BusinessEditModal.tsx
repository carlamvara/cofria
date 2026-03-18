import React, { useState } from 'react';
import { X } from 'lucide-react';
import { theme, PROFESSIONS } from '../../logic/constants';
import { Button } from './Button';
import { Input } from './Input';

interface BusinessEditModalProps {
  onClose: () => void;
  user: any;
  setUser: (user: any) => void;
  t: any;
}

export const BusinessEditModal: React.FC<BusinessEditModalProps> = ({ onClose, user, setUser, t }) => {
  const [businessData, setBusinessData] = useState({
    profession: user?.profession || '',
    licenseNumber: user?.licenseNumber || '',
    businessAddress: user?.businessAddress || '',
    businessPhone: user?.businessPhone || '',
    webLinks: user?.webLinks || '',
    socialMedia: user?.socialMedia || '',
    instagram: user?.instagram || '',
    facebook: user?.facebook || '',
    patientCount: user?.patientCount || ''
  });

  const handleSaveBusiness = () => {
    if (user) {
      setUser({ 
        ...user, 
        ...businessData
      });
      alert('Datos de negocio actualizados con éxito.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md shadow-2xl border border-[#E5E0D6] p-6 relative animate-fade-in-up rounded-xl max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10"><X size={20} /></button>
        
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <h3 className={`${theme.fontSerif} text-2xl mb-6 text-[#1A233A]`}>{t.profile.editBusinessTitle}</h3>
          
          <div className="space-y-4">
            <Input label={t.profile.profession} value={businessData.profession} onChange={e => setBusinessData({...businessData, profession: e.target.value})} />
            <Input label={t.profile.license} value={businessData.licenseNumber} onChange={e => setBusinessData({...businessData, licenseNumber: e.target.value})} placeholder="Nº Matrícula" />
            <Input label="Dirección del Consultorio/Negocio" value={businessData.businessAddress} onChange={e => setBusinessData({...businessData, businessAddress: e.target.value})} placeholder="Calle, Ciudad, CP" />
            <Input label="Teléfono del Consultorio" value={businessData.businessPhone} onChange={e => setBusinessData({...businessData, businessPhone: e.target.value})} placeholder="+34..." />
            <Input label="Web" value={businessData.webLinks} onChange={e => setBusinessData({...businessData, webLinks: e.target.value})} placeholder="https://..." />
            <Input label="LinkedIn" value={businessData.socialMedia} onChange={e => setBusinessData({...businessData, socialMedia: e.target.value})} placeholder="https://linkedin.com/in/..." />
            <Input label="Instagram" value={businessData.instagram} onChange={e => setBusinessData({...businessData, instagram: e.target.value})} placeholder="@usuario" />
            <Input label="Facebook" value={businessData.facebook} onChange={e => setBusinessData({...businessData, facebook: e.target.value})} placeholder="facebook.com/..." />
            <Input label="Cantidad de pacientes/clientes" value={businessData.patientCount} onChange={e => setBusinessData({...businessData, patientCount: e.target.value})} placeholder="Ej: 50" />

            <div className="flex gap-2 pt-6 pb-2">
              <Button variant="secondary" className="flex-1 py-3 text-xs" onClick={onClose}>Cancelar</Button>
              <Button 
                className="flex-1 py-3 text-xs" 
                onClick={handleSaveBusiness}
              >
                {t.profile.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
