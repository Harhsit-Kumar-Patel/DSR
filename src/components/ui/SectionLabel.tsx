import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, className = '' }) => {
  return (
    <span 
      className={`block uppercase ${className}`}
      style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.05em',
        color: 'var(--text-muted)'
      }}
    >
      {children}
    </span>
  );
};
