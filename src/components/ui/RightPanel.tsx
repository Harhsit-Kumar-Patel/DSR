import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = '480px'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Container */}
      <div
        style={{
          width,
          height: '100vh',
          background: 'var(--card)',
          borderLeft: '1px solid var(--border-def)',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.20)',
          zIndex: 60,
          position: 'relative'
        }}
        className="flex flex-col overflow-hidden text-slate-900"
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px 17px',
            borderBottom: '1px solid var(--border-muted)'
          }}
          className="flex items-center justify-between shrink-0"
        >
          <div className="space-y-0.5">
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-pri)',
                letterSpacing: '-0.01em'
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--text-muted)'
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              borderRadius: '4px',
              padding: '4px'
            }}
            className="hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '20px 24px'
          }}
          className="flex-1 overflow-y-auto custom-scroll space-y-5"
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '17px 24px 16px',
              borderTop: '1px solid var(--border-muted)',
              gap: '8px'
            }}
            className="flex items-center justify-end shrink-0"
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
