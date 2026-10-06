import React from 'react';
import { useRealtimeSLA } from '../../hooks/useRealtimeSLA';
import { formatSlaDate } from '../../utils/slaCalculator';
import { Clock, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface LiveSLABadgeProps {
  deadlineTimestamp: string;
  startTimestamp?: string;
  receivedTimestamp?: string;
  isCompleted?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
  className?: string;
}

export const LiveSLABadge: React.FC<LiveSLABadgeProps> = ({
  deadlineTimestamp,
  startTimestamp,
  receivedTimestamp,
  isCompleted = false,
  size = 'md',
  showLabel = true,
  onClick,
  className = ''
}) => {
  const sla = useRealtimeSLA(deadlineTimestamp, startTimestamp, receivedTimestamp, isCompleted);

  const getStatusStyles = () => {
    if (isCompleted) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        text: 'Completed in SLA'
      };
    }

    switch (sla.status) {
      case 'OVERDUE':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
          dot: 'bg-rose-600',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
          text: 'OVERDUE'
        };
      case 'DUE SOON':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          text: 'DUE SOON'
        };
      case 'ON TRACK':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <Clock className="w-3.5 h-3.5 text-emerald-600" />,
          text: 'ON TRACK'
        };
    }
  };

  const styles = getStatusStyles();

  if (size === 'sm') {
    return (
      <div 
        onClick={onClick}
        className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${styles.bg} ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
        title={`SLA Status: ${sla.status} · ${sla.timeRemainingFormatted}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        <span>{isCompleted ? 'Completed' : sla.timeRemainingFormatted}</span>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div 
        onClick={onClick}
        className={`p-3 rounded-xl border ${styles.bg} ${onClick ? 'cursor-pointer hover:shadow-sm' : ''} ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            {styles.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {showLabel ? 'Real-Time SLA' : ''}
            </span>
          </div>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
            sla.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' :
            sla.status === 'DUE SOON' ? 'bg-amber-100 text-amber-900' :
            'bg-emerald-100 text-emerald-800'
          }`}>
            {styles.text}
          </span>
        </div>

        <div className="mt-1">
          <span className="font-mono font-bold text-sm tracking-tight block">
            {isCompleted ? 'Completed within SLA' : sla.timeRemainingFormatted}
          </span>
          <span className="text-[10px] opacity-75 block mt-0.5">
            Deadline: {formatSlaDate(deadlineTimestamp)}
          </span>
        </div>
      </div>
    );
  }

  // Medium (Default)
  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${styles.bg} ${onClick ? 'cursor-pointer hover:shadow-xs transition-shadow' : ''} ${className}`}
      title={`Real-Time SLA: ${sla.status}`}
    >
      <span className={`w-2 h-2 rounded-full ${styles.dot} ${sla.status !== 'COMPLETED' ? 'animate-pulse' : ''}`} />
      <span>{isCompleted ? 'Completed' : sla.timeRemainingFormatted}</span>
      <span className="text-[10px] uppercase font-sans font-extrabold px-1 rounded bg-white/70">
        {styles.text}
      </span>
    </div>
  );
};
