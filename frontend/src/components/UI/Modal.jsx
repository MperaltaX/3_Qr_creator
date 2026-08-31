import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }}
    >
      <div 
        className="card w-full max-w-lg m-4 flex flex-col"
        style={{ width: '100%', maxWidth: '32rem', margin: '1rem', display: 'flex', flexDirection: 'column' }}
      >
        <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button variant="ghost" onClick={onClose} style={{ padding: '0.25rem' }}>
            <X size={20} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
