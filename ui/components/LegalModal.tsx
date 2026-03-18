import React from 'react';
import { X } from 'lucide-react';
import { theme } from '../../logic/constants';
import { Button } from './Button';
import { ArchIcon } from './ArchIcon';

interface LegalModalProps {
  type: string;
  onClose: () => void;
  t: any;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, t }) => {
  const content = t.legal[`${type}Content`];
  const title = t.legal[`${type}Title`];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border border-[#E5E0D6] p-8 md:p-12 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#5D6B82] hover:text-[#1A233A] transition-colors">
          <X size={24} />
        </button>
        <ArchIcon className="w-8 h-8 mb-6 text-[#C4A166]" />
        <h2 className={`${theme.fontSerif} text-3xl md:text-4xl mb-8 text-[#1A233A]`}>{title}</h2>
        <div className="space-y-8">
          {content.map((section: any, idx: number) => (
            <div key={idx}>
              <h3 className="text-sm uppercase tracking-widest font-bold text-[#1A233A] mb-3">{section.title}</h3>
              <p className={`text-sm md:text-base leading-relaxed ${theme.textMuted}`}>{section.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-[#E5E0D6]/40 text-center">
          <Button onClick={onClose} className="w-full md:w-auto min-w-[200px]">{t.legal.close}</Button>
        </div>
      </div>
    </div>
  );
};
