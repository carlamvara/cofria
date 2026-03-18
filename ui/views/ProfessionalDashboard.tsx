import React, { useState } from 'react';
import { theme } from '../../logic/constants';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { User, Mail, Send, CheckCircle, Clock, X, Globe, Copy, Award, Eye, EyeOff, Camera } from 'lucide-react';
import { ProfessionalInvitation } from '../../logic/types';

interface ProfessionalDashboardProps {
  t: any;
  user: any;
  setUser: (user: any) => void;
  navigate: (view: string) => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ t, user, setUser, navigate }) => {
  const [invitations, setInvitations] = useState<ProfessionalInvitation[]>([
    { email: 'carlamarielvara@gmail.com', status: 'sealed', date: '2024-05-10', messageType: 'direct' },
    { email: 'paciente_test@email.com', status: 'sent', date: '2024-05-12', messageType: 'direct' },
    { email: 'herencia_familiar@test.com', status: 'activated', date: '2024-05-15', messageType: 'custody' },
    { email: 'voluntad_digital@gmail.com', status: 'sent', date: '2024-05-18', messageType: 'custody' },
    { email: 'cliente_premium@outlook.com', status: 'sealed', date: '2024-05-20', messageType: 'direct' }
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Local state for profile editing
  const [profileData, setProfileData] = useState({
    bio: user.bio || '',
    publicEmail: user.publicEmail || user.email,
    isPublic: user.isPublic !== false,
    photoUrl: user.photoUrl || ''
  });

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    if (name.length <= 2) return `${name[0]}*@${domain}`;
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  const handleSendInvite = () => {
    if (inviteEmail) {
      setInvitations([{ 
        email: inviteEmail, 
        status: 'sent', 
        date: new Date().toISOString().split('T')[0],
        messageType: 'direct'
      }, ...invitations]);
      setShowConfirmation(true);
      setInviteEmail('');
    }
  };

  const handleUpdateProfile = () => {
    setUser({ ...user, ...profileData });
    alert(t.profile.saveSuccess || 'Perfil actualizado');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://cofria.com/ref/${user.id || 'prof'}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const sealedCount = invitations.filter(i => i.status === 'sealed').length;

  return (
    <div className={`min-h-screen py-16 px-4 md:px-12 ${theme.bg}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className={`${theme.fontSerif} text-4xl text-[#1A233A]`}>{t.professional.dashboard}</h2>
              <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold ${profileData.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {profileData.isPublic ? 'Visible' : 'Oculto'}
              </span>
            </div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">{user.name} {user.surname} — {user.profession}</p>
          </div>
          <button 
            onClick={() => navigate('dashboard')}
            className="text-[10px] uppercase tracking-widest font-bold text-[#C4A166] border-b border-[#C4A166] pb-1 hover:text-[#1A233A] hover:border-[#1A233A] transition-all"
          >
            {t.professional.goToVault}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile & Stats (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 border border-[#E5E0D6] rounded-xl shadow-sm flex justify-between items-center">
                <p className="text-[9px] uppercase tracking-widest text-gray-400">{t.professional.annualBenefit}</p>
                <p className={`text-sm font-bold ${user.annualMessageUsed ? 'text-gray-400' : 'text-emerald-600'}`}>
                  {user.annualMessageUsed ? t.professional.used : t.professional.available}
                </p>
              </div>
            </div>

            {/* Public Profile Editor */}
            <div className="bg-white p-8 border border-[#E5E0D6] shadow-sm rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A233A] flex items-center gap-2">
                  <Globe size={14} /> {t.professional.publicProfile}
                </h3>
                <button 
                  onClick={() => setProfileData({...profileData, isPublic: !profileData.isPublic})}
                  className={`p-2 rounded-lg transition-colors ${profileData.isPublic ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 bg-gray-50'}`}
                >
                  {profileData.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                      {profileData.photoUrl ? (
                        <img src={profileData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-gray-300" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-[#1A233A] text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={12} />
                    </button>
                  </div>
                </div>

                <Input label={t.professional.publicEmail} value={profileData.publicEmail} onChange={e => setProfileData({...profileData, publicEmail: e.target.value})} icon={<Mail size={14}/>} />
                
                <div className="text-left">
                  <label className="block text-[10px] uppercase tracking-widest text-[#5D6B82] mb-2">{t.professional.bio}</label>
                  <textarea 
                    className="w-full bg-white border border-[#E5E0D6] p-4 text-sm focus:outline-none focus:border-[#1A233A] transition-colors min-h-[100px] rounded-lg"
                    value={profileData.bio}
                    onChange={e => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Cuéntale a tus clientes por qué confías en COFRIA..."
                  />
                </div>

                <Button className="w-full" variant="secondary" onClick={handleUpdateProfile}>{t.professional.saveProfile}</Button>
              </div>
            </div>
          </div>

          {/* Right Column: Invitations & Activity (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Invitation & Link Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1A233A] p-8 text-white rounded-xl shadow-xl">
                <h3 className="text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                  <Send size={14} /> {t.professional.inviteClient}
                </h3>
                <div className="space-y-4">
                  <input 
                    type="email"
                    className="w-full bg-white/10 border border-white/20 p-3 text-sm focus:outline-none focus:border-[#C4A166] transition-colors rounded-lg text-white placeholder:text-white/40"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="email@cliente.com"
                  />
                  <Button className="w-full" onClick={handleSendInvite} disabled={!inviteEmail}>{t.professional.sendInvite}</Button>
                </div>
              </div>

              <div className="bg-white p-8 border border-[#E5E0D6] shadow-sm rounded-xl">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A233A] mb-6 flex items-center gap-2">
                  <Award size={14} /> {t.professional.referralLink}
                </h3>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-100 p-3 rounded-lg text-xs text-gray-500 font-mono truncate">
                    cofria.com/ref/{user.id || 'prof'}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className={`p-3 rounded-lg border transition-all ${copySuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-[#E5E0D6] text-[#1A233A] hover:border-[#C4A166]'}`}
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <p className="mt-4 text-[10px] text-gray-400 leading-relaxed italic">
                  * {t.professional.referralNote}
                </p>
              </div>
            </div>

            {/* Invitations Table */}
            <div className="bg-white border border-[#E5E0D6] shadow-sm rounded-xl overflow-hidden">
              <div className="p-6 border-b border-[#E5E0D6] flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A233A]">{t.professional.invitations}</h3>
                <div className="flex gap-4">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{invitations.length} {t.professional.stats.totalInvited}</span>
                  <span className="text-[10px] text-[#C4A166] font-bold uppercase tracking-widest">{sealedCount} {t.professional.stats.totalSealed}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F7F5F0] text-[10px] uppercase tracking-widest text-[#5D6B82]">
                      <th className="px-6 py-4 font-bold">{t.professional.inviteEmail}</th>
                      <th className="px-6 py-4 font-bold">Fecha</th>
                      <th className="px-6 py-4 font-bold">{t.professional.status}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F5F0]">
                    {invitations.map((inv, i) => (
                      <tr key={i} className="hover:bg-[#F7F5F0]/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-[#1A233A] font-medium">{maskEmail(inv.email)}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{inv.date}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                            inv.status === 'sealed' ? 'bg-emerald-100 text-emerald-700' : 
                            inv.status === 'activated' ? 'bg-blue-100 text-blue-700' : 
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {t.professional[inv.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm shadow-2xl border border-[#E5E0D6] p-8 relative animate-fade-in-up rounded-xl text-center">
            <button onClick={() => setShowConfirmation(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h3 className={`${theme.fontSerif} text-2xl mb-4 text-[#1A233A]`}>Invitación Enviada</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">La invitación ha sido enviada con éxito.</p>
            <Button className="w-full" onClick={() => setShowConfirmation(false)}>Entendido</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalDashboard;
