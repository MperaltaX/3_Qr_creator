import React, { useState } from 'react';
import { useQRDesignStore } from '../../stores/useQRDesignStore';
import Tabs from '../UI/Tabs';
import ColorPicker from '../UI/ColorPicker';
import Card from '../UI/Card';

const DesignPanel = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const { design, updateNestedDesign, updateDesign } = useQRDesignStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateDesign('image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="h-full">
      <Tabs 
        activeTab={activeTab} 
        onChange={setActiveTab}
        tabs={[
          { id: 'colors', label: 'Colores' },
          { id: 'shapes', label: 'Formas' },
          { id: 'logo', label: 'Logo' }
        ]}
      />

      <div className="mt-4" style={{ marginTop: '1rem' }}>
        {activeTab === 'colors' && (
          <div className="animate-fade-in">
            <h3 className="text-sm font-semibold mb-3" style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Puntos del QR</h3>
            <ColorPicker 
              label="Color de los puntos" 
              color={design.dotsOptions.color} 
              onChange={(c) => updateNestedDesign('dotsOptions', 'color', c)} 
            />
            
            <h3 className="text-sm font-semibold mb-3 mt-6" style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem' }}>Ojos del QR</h3>
            <ColorPicker 
              label="Color de las esquinas (Ojos)" 
              color={design.cornersSquareOptions.color} 
              onChange={(c) => {
                updateNestedDesign('cornersSquareOptions', 'color', c);
                updateNestedDesign('cornersDotOptions', 'color', c);
              }} 
            />
            
            <h3 className="text-sm font-semibold mb-3 mt-6" style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem' }}>Fondo</h3>
            <ColorPicker 
              label="Color de fondo" 
              color={design.backgroundOptions.color} 
              onChange={(c) => updateNestedDesign('backgroundOptions', 'color', c)} 
            />
          </div>
        )}

        {activeTab === 'shapes' && (
          <div className="animate-fade-in">
             <h3 className="text-sm font-semibold mb-3" style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Estilo de los puntos</h3>
             <select 
               className="input mb-6" 
               value={design.dotsOptions.type}
               onChange={(e) => updateNestedDesign('dotsOptions', 'type', e.target.value)}
               style={{ marginBottom: '1.5rem' }}
             >
               <option value="square">Cuadrado</option>
               <option value="dots">Puntos</option>
               <option value="rounded">Redondeado</option>
               <option value="extra-rounded">Extra Redondeado</option>
               <option value="classy">Classy</option>
               <option value="classy-rounded">Classy Redondeado</option>
             </select>

             <h3 className="text-sm font-semibold mb-3" style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Estilo de los ojos</h3>
             <select 
               className="input" 
               value={design.cornersSquareOptions.type}
               onChange={(e) => updateNestedDesign('cornersSquareOptions', 'type', e.target.value)}
             >
               <option value="square">Cuadrado</option>
               <option value="dot">Punto</option>
               <option value="extra-rounded">Extra Redondeado</option>
             </select>
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="animate-fade-in">
            <h3 className="text-sm font-semibold mb-3" style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Subir Logo</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              El logo se colocará en el centro del código QR.
            </p>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleImageUpload}
              className="input p-2"
              style={{ padding: '0.5rem' }}
            />
            {design.image && (
              <button 
                className="btn btn-danger mt-4 text-xs" 
                onClick={() => updateDesign('image', null)}
                style={{ marginTop: '1rem', fontSize: '0.75rem' }}
              >
                Quitar Logo
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DesignPanel;
