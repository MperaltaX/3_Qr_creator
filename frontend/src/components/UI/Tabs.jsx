import React from 'react';

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b border-[var(--border-color)] mb-4" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
          style={{ 
            padding: '0.5rem 1rem', 
            fontSize: '0.875rem', 
            fontWeight: 500,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
