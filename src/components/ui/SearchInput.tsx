import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: string | number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  width = '320px'
}) => {
  return (
    <div className={`relative flex items-center ${className}`} style={{ width }}>
      <Search 
        className="w-4 h-4 absolute left-2.5 pointer-events-none" 
        style={{ color: 'var(--text-muted)' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--border-def)',
          borderRadius: '4px',
          height: '36px',
          padding: '8px 11px 8px 32px',
          fontSize: '13px',
          fontWeight: 400,
          color: 'var(--text-pri)',
          width: '100%',
          outline: 'none'
        }}
        className="focus:border-blue-500 transition-colors"
      />
    </div>
  );
};
