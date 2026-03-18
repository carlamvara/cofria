import React from 'react';
import { theme } from '../../logic/constants';

interface InputProps {
  label: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  min?: string;
  readOnly?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  type = "text", 
  value = "", 
  onChange, 
  placeholder = "", 
  icon = null,
  className = "",
  min,
  readOnly
}) => (
  <div className={`mb-4 ${className}`}>
    <label className={`block text-xs uppercase tracking-widest ${theme.textMuted} mb-2`}>{label}</label>
    <div className="relative">
      <input 
        type={type} 
        value={value} 
        onChange={onChange}
        readOnly={readOnly || !onChange}
        placeholder={placeholder}
        min={min}
        className={`w-full bg-white border ${theme.border} p-3 ${icon ? 'pl-10' : ''} text-sm focus:outline-none focus:border-[#1A233A] transition-colors ${readOnly || !onChange ? 'bg-gray-50 text-gray-500' : ''}`}
      />
      {icon && <div className="absolute left-3 top-3 text-gray-400">{icon}</div>}
    </div>
  </div>
);
