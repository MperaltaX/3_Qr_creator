import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentPanel from '../components/QRBuilder/ContentPanel';
import DesignPanel from '../components/QRBuilder/DesignPanel';
import PreviewQR from '../components/QRBuilder/PreviewQR';
import Button from '../components/UI/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { useQRDesignStore } from '../stores/useQRDesignStore';
import toast from 'react-hot-toast';
import api from '../services/api';

const CreateQR = () => {
  const navigate = useNavigate();
  const { type, contentData, design, isDynamic } = useQRDesignStore();

  const handleSave = async () => {
    try {
      const payload = {
        name: type === 'URL' ? contentData.url : `QR ${type}`,
        type,
        destination_url: contentData.url || '',
        content_data: contentData,
        design_settings: design,
        is_dynamic: isDynamic
      };
      await api.post('/qr', payload);
      toast.success('QR Creado exitosamente');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al guardar el QR');
    }
  };

  return (
    <div className="container mt-8 h-screen flex flex-col pb-8" style={{ width: '100%', maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', height: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}>
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard">
            <Button variant="ghost" style={{ padding: '0.5rem' }}>
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Crear Nuevo QR</h1>
        </div>
        <Button onClick={handleSave}>
          <Save size={18} /> Guardar y Generar Enlace
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* Columna Izquierda: Contenido y Diseño */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-2" style={{ gridColumn: 'span 8 / span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          <ContentPanel />
          <DesignPanel />
        </div>

        {/* Columna Derecha: Preview */}
        <div className="lg:col-span-4" style={{ gridColumn: 'span 4 / span 4' }}>
          <div className="sticky top-0 h-full" style={{ position: 'sticky', top: 0, height: '100%' }}>
            <PreviewQR />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateQR;
