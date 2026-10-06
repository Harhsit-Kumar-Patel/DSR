import React from 'react';

export interface MetaField {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

interface MetaStripProps {
  fields: MetaField[];
  className?: string;
}

export const MetaStrip: React.FC<MetaStripProps> = ({ fields, className = '' }) => {
  return (
    <div 
      className={`flex flex-wrap items-center gap-6 py-3 px-4 ${className}`}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border-def)',
        borderRadius: '4px'
      }}
    >
      {fields.map((f, i) => (
        <div key={i} className="space-y-0.5 min-w-[120px]">
          <span 
            className="block uppercase"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              color: 'var(--text-muted)'
            }}
          >
            {f.label}
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span 
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-pri)'
              }}
            >
              {f.value}
            </span>
            {f.hint && (
              <span 
                style={{
                  fontSize: '11px',
                  fontWeight: 400,
                  color: 'var(--text-muted)'
                }}
              >
                {f.hint}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
