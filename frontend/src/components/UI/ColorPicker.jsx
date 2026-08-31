import React from 'react';

const ColorPicker = ({ label, color, onChange }) => {
  return (
    <div className="flex-col mb-4" style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
      {label && <label className="input-label" style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</label>}
      <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div 
          className="w-10 h-10 rounded-md border border-[var(--border-color)] overflow-hidden cursor-pointer"
          style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}
        >
          <input 
            type="color" 
            value={color} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-0 border-0 cursor-pointer"
            style={{ width: '150%', height: '150%', padding: 0, border: 'none', margin: '-25%' }}
          />
        </div>
        <span className="text-sm font-mono text-[var(--text-muted)] uppercase" style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
          {color}
        </span>
      </div>
    </div>
  );
};

export default ColorPicker;
