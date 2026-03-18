import React from 'react';
import { theme } from '../../logic/constants';
import { Button } from '../components/Button';
import { Search, MapPin, Briefcase, Mail, ChevronLeft } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  location: string;
  email: string;
  bio: string;
  photo?: string;
}

interface ProfessionalListProps {
  t: any;
  navigate: (view: string) => void;
}

export const ProfessionalList: React.FC<ProfessionalListProps> = ({ t, navigate }) => {
  // Mock data for professionals
  const professionals: Professional[] = [
    {
      id: '1',
      name: 'Dra. Elena Martínez',
      specialty: 'Abogada de Sucesiones',
      location: 'Madrid, España',
      email: 'elena.martinez@legal.com',
      bio: 'Especialista en planificación sucesoria y protección de legados digitales con más de 15 años de experiencia.',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '2',
      name: 'Dr. Roberto Silva',
      specialty: 'Psicólogo Clínico',
      location: 'Buenos Aires, Argentina',
      email: 'roberto.silva@psico.com',
      bio: 'Acompañamiento en procesos de duelo y preparación para el final de la vida. Experto en comunicación familiar.',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '3',
      name: 'Lic. Claudia Rossi',
      specialty: 'Notaria Pública',
      location: 'Milán, Italia',
      email: 'claudia.rossi@notaria.it',
      bio: 'Garantizando la validez legal de voluntades y documentos digitales en el marco de la Unión Europea.',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop'
    }
  ];

  return (
    <div className={`min-h-screen ${theme.bg} py-20 px-6`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#1A233A] transition-colors mb-8"
          >
            <ChevronLeft size={16} /> {t.onboarding.back}
          </button>
          
          <h1 className={`${theme.fontSerif} text-4xl md:text-6xl text-[#1A233A] mb-6`}>
            {t.professionals.title}
          </h1>
          <p className={`${theme.textMuted} text-lg max-w-2xl`}>
            {t.professionals.subtitle}
          </p>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-6">
          {professionals.length > 0 ? (
            professionals.map((prof) => (
              <div key={prof.id} className="bg-white p-6 md:p-8 border border-[#E5E0D6] shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center">
                
                {/* Photo */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-2 border-[#F7F5F0]">
                  <img src={prof.photo} alt={prof.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                    <h2 className={`${theme.fontSerif} text-2xl text-[#1A233A]`}>{prof.name}</h2>
                    <span className="px-3 py-1 bg-[#F7F5F0] text-[#C4A166] text-[10px] uppercase tracking-widest font-bold rounded-full border border-[#E5E0D6]">
                      {prof.specialty}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} /> {prof.location}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                    {prof.bio}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white border border-dashed border-[#E5E0D6] rounded-xl">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400">{t.professionals.empty}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
