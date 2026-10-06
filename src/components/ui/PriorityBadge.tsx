import React from 'react';
import { UrgencyLevel } from '../../types/intake';

interface PriorityBadgeProps {
  urgency: UrgencyLevel;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ urgency, className = '' }) => {
  const getColor = () => {
    switch (urgency) {
      case 'Critical':
        return '#dc2626';
      case 'High':
        return '#ea580c';
      case 'Medium':
        return '#d97706';
      case 'Standard':
      default:
        return 'var(--text-sec)';
    }
  };

  const color = getColor();

  return (
    <div className={`inline-flex items-center space-x-1.5 ${className}`}>
      {/* 3-bar signal SVG */}
      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor">
        <rect x="2" y="10" width="2.5" height="4" rx="0.5" fill={color} />
        <rect x="6.5" y="6" width="2.5" height="8" rx="0.5" fill={urgency !== 'Standard' ? color : 'var(--border-def)'} />
        <rect x="11" y="2" width="2.5" height="12" rx="0.5" fill={urgency === 'Critical' || urgency === 'High' ? color : 'var(--border-def)'} />
      </svg>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 500,
          color: color
        }}
      >
        {urgency}
      </span>
    </div>
  );
};
