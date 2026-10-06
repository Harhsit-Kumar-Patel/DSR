import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface PageTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const PageTabBar: React.FC<PageTabBarProps> = ({
  tabs,
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div 
      className={`flex items-center space-x-6 ${className}`}
      style={{
        borderBottom: '1px solid var(--border-def)'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: isActive ? 'var(--accent)' : 'var(--text-sec)',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              padding: '10px 2px 12px 2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              marginBottom: '-1px'
            }}
            className="hover:text-blue-700 transition-colors"
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: isActive ? 'var(--accent-sub)' : 'var(--bg-element)',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)'
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
