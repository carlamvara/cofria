import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { theme } from './logic/constants';
import { translations } from './logic/translations';
import { Message } from './logic/types';
import { ArchIcon } from './ui/components/ArchIcon';
import { Navbar } from './ui/components/Navbar';
import { Footer } from './ui/components/Footer';
import { LegalModal } from './ui/components/LegalModal';
import { SettingsModal } from './ui/components/SettingsModal';
import { ProfessionalRequestModal } from './ui/components/ProfessionalRequestModal';
import { BusinessEditModal } from './ui/components/BusinessEditModal';
import { PaymentMethodsModal } from './ui/components/PaymentMethodsModal';
import { AdminLoginModal } from './ui/components/AdminLoginModal';
import { Hero } from './ui/views/Hero';
import { LoginRegister } from './ui/views/LoginRegister';
import { Dashboard } from './ui/views/Dashboard';
import { CreateMessage } from './ui/views/CreateMessage';
import { RecipientRitual } from './ui/views/RecipientRitual';
import { CustodianPortal } from './ui/views/CustodianPortal';
import { Backoffice } from './ui/views/Backoffice';
import { ProfessionalDashboard } from './ui/views/ProfessionalDashboard';
import { Onboarding } from './ui/views/Onboarding';
import { ProfessionalList } from './ui/views/ProfessionalList';

import './index.css';

// --- Main App Component ---

function CofriaApp() {
  const [lang, setLang] = useState('es');
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState<any | null>(null); 
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'direct', recipient: 'sarah@example.com', status: 'sealed', content: 'Happy 30th Birthday!', title: 'Para tus 30s', sealingDate: '12/05/2024', openingDate: '14/06/2030 10:00', hasCustodian: false, lastAction: 'Sellado por el remitente.', remainingEdits: 1 },
    { id: 2, type: 'custody', recipient: 'brother@test.com', status: 'draft', content: 'En caso de que algo pase...', title: 'Borrador Voluntad', hasCustodian: true, lastAction: 'Edición en progreso.', remainingEdits: 1 },
    { id: 3, type: 'custody', recipient: 'heritage@cofria.com', status: 'sealed', content: 'Testamento digital.', title: 'Herencia Familiar', sealingDate: '01/02/2024', hasCustodian: true, custodianAccepted: true, lastAction: 'Custodio asignado y confirmado.', remainingEdits: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfessionalRequest, setShowProfessionalRequest] = useState(false);
  const [showBusinessEdit, setShowBusinessEdit] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settingsOnlyProfile, setSettingsOnlyProfile] = useState(false);

  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showReferral, setShowReferral] = useState(false);

  const t = translations[lang as keyof typeof translations];

  const navigate = (target: string) => { setLoading(true); setTimeout(() => { setView(target); setLoading(false); }, 400); };

  return (
    <div className={`min-h-screen ${theme.textMain} font-sans selection:bg-[#C4A166] selection:text-white`}>
      {view !== 'ritual' && view !== 'view-demo' && <Navbar t={t} user={user} setUser={setUser} navigate={navigate} lang={lang} setLang={setLang} setShowSettings={setShowSettings} setSettingsOnlyProfile={setSettingsOnlyProfile} />}
      <main>
        {loading ? (
          <div className="h-[80vh] flex flex-col items-center justify-center gap-8">
            <ArchIcon className="w-16 h-16 text-[#C4A166] animate-pulse" />
            <p className="text-[9px] uppercase tracking-[0.6em] font-black opacity-10">Trascendiendo...</p>
          </div>
        ) : (<>
            {view === 'home' && <Hero t={t} user={user} navigate={navigate} />}
            {view === 'onboarding' && <Onboarding t={t} navigate={navigate} />}
            {view === 'login' && <LoginRegister t={t} setUser={setUser} navigate={navigate} />}
            {view === 'dashboard' && <Dashboard t={t} user={user} navigate={navigate} messages={messages} setMessages={setMessages} setEditingMessage={setEditingMessage} showReferral={showReferral} setShowReferral={setShowReferral} />}
            {view === 'create' && <CreateMessage t={t} lang={lang} user={user} setUser={setUser} navigate={navigate} messages={messages} setMessages={setMessages} editingMessage={editingMessage} setEditingMessage={setEditingMessage} showReferral={showReferral} setShowReferral={setShowReferral} />}
            {view === 'professional-dashboard' && <ProfessionalDashboard t={t} user={user} setUser={setUser} navigate={navigate} />}
            {view === 'view-demo' && <RecipientRitual t={t} navigate={navigate} />}
            {view === 'custodian-demo' && <CustodianPortal t={t} navigate={navigate} />}
            {view === 'professional-list' && <ProfessionalList t={t} navigate={navigate} />}
            {view === 'backoffice' && <Backoffice t={t} />}
        </>)}
      </main>
      {view !== 'ritual' && view !== 'view-demo' && view !== 'custodian-demo' && view !== 'backoffice' && (
        <Footer t={t} lang={lang} setActiveModal={setActiveModal} navigate={navigate} setShowAdminLogin={setShowAdminLogin} />
      )}

      {showAdminLogin && (
        <AdminLoginModal 
          onClose={() => setShowAdminLogin(false)} 
          onLogin={(pass) => {
            if (pass === 'admin123') {
              setIsAdmin(true);
              navigate('backoffice');
              setShowAdminLogin(false);
            }
          }}
          t={t}
        />
      )}
      {activeModal && <LegalModal type={activeModal} onClose={() => setActiveModal(null)} t={t} />}
      {showSettings && <SettingsModal onClose={() => { setShowSettings(false); setSettingsOnlyProfile(false); }} user={user} setUser={setUser} t={t} setLang={setLang} lang={lang} setActiveModal={setActiveModal} onlyProfile={settingsOnlyProfile} setShowProfessionalRequest={setShowProfessionalRequest} navigate={navigate} currentView={view} setShowBusinessEdit={setShowBusinessEdit} setShowPaymentMethods={setShowPaymentMethods} />}
      {showProfessionalRequest && <ProfessionalRequestModal onClose={() => setShowProfessionalRequest(false)} user={user} setUser={setUser} t={t} />}
      {showBusinessEdit && <BusinessEditModal onClose={() => setShowBusinessEdit(false)} user={user} setUser={setUser} t={t} />}
      {showPaymentMethods && <PaymentMethodsModal onClose={() => setShowPaymentMethods(false)} user={user} setUser={setUser} t={t} />}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<CofriaApp />);
}
