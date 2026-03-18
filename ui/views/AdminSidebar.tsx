import React from 'react';
import { theme } from '../../logic/constants';
import { X, LayoutDashboard, ShieldCheck, CreditCard, FileText, Users, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  t: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView, t, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel de Control', icon: <LayoutDashboard size={18} /> },
    { id: 'users', label: 'Gestión de Usuarios', icon: <Users size={18} /> },
    { id: 'professionals', label: 'Gestión de Profesionales', icon: <Users size={18} /> },
    { id: 'transactions', label: 'Transacciones', icon: <CreditCard size={18} /> },
    { id: 'audit', label: 'Registro de Auditoría', icon: <ShieldCheck size={18} /> },
    { id: 'payments', label: 'Pagos', icon: <CreditCard size={18} /> },
    { id: 'legal', label: 'Legal y Privacidad', icon: <FileText size={18} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-[#1A233A] text-[#F7F5F0] p-6 flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex justify-end mb-6 lg:hidden">
          <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1 pt-8 lg:pt-0">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveView(item.id); setIsOpen(false); }} 
              className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all text-sm font-medium ${
                activeView === item.id 
                  ? 'bg-[#C4A166] text-[#1A233A] shadow-lg shadow-[#C4A166]/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10">
          <button 
            onClick={() => window.location.href = '/'} 
            className="flex items-center gap-3 w-full text-left p-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};
