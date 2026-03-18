import React from 'react';
import { theme } from '../../logic/constants';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, className = '', disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-md text-sm tracking-widest uppercase font-medium ${variant === 'primary' ? theme.buttonPrimary : variant === 'danger' ? theme.buttonDanger : theme.buttonSecondary} ${className}`}
  >
    {children}
  </button>
);
