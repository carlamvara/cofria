import React from 'react';
import { Edit3 } from 'lucide-react';

export const EditDisabledIcon = ({ className }: { className?: string }) => (
  <div className={`relative inline-block ${className}`}>
    <Edit3 size={18} />
    <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#1A233A] -rotate-45 transform origin-center"></div>
  </div>
);
