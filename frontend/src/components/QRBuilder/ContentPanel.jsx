import React from 'react';
import { useQRDesignStore } from '../../stores/useQRDesignStore';
import Card from '../UI/Card';
import Input from '../UI/Input';

const ContentPanel = () => {
  const { type, setType, contentData, setContentData, isDynamic, setIsDynamic } = useQRDesignStore();

  const types = [
    { id: 'URL', icon: '🔗', label: 'URL' },
    { id: 'TEXT', icon: '📝', label: 'Texto' },
    { id: 'EMAIL', icon: '✉️', label: 'Email' },
    { id: 'WIFI', icon: '📶', label: 'WiFi' },
    { id: 'VCARD', icon: '📇', label: 'vCard' }
  ];

  const handleURLChange = (e) => {
    setContentData({ url: e.target.value });
  };

  return (
    <Card className="h-full">
      <h2 className="text-xl font-bold mb-4" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Contenido del QR</h2>

      <div className="grid grid-cols-5 gap-2 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${type === t.id
                ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-10 text-white'
                : 'border-[var(--border-color)] bg-transparent hover:border-[var(--text-muted)] text-[var(--text-muted)]'
              }`}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', borderRadius: '0.5rem', borderWidth: '1px', borderStyle: 'solid',
              borderColor: type === t.id ? 'var(--primary)' : 'var(--border-color)',
              background: type === t.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: type === t.id ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <span className="text-2xl mb-1" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{t.icon}</span>
            <span className="text-xs font-medium" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <h3 className="text-sm font-bold text-[var(--text-muted)]" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>Modo del QR</h3>
        <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          <button
            onClick={() => type !== 'WIFI' && setIsDynamic(true)}
            className={`p-4 rounded-xl border text-left transition-all ${isDynamic ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-10' : 'border-[var(--border-color)] opacity-70'} ${type === 'WIFI' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-[var(--primary)]'}`}
            style={{ padding: '1rem', borderRadius: '0.75rem', borderWidth: '1px', borderStyle: 'solid', textAlign: 'left', borderColor: isDynamic ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)', background: isDynamic ? 'rgba(139, 92, 246, 0.1)' : 'transparent' }}
          >
            <h4 className="font-bold text-[var(--text-main)] mb-1" style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Dinámico</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Inyecta una URL corta. Permite medir estadísticas y editar el contenido sin reimprimir. <br /><br />
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Nota: Requiere configuración adicional con dominio propio.</span>
            </p>
          </button>
          <button
            onClick={() => setIsDynamic(false)}
            className={`p-4 rounded-xl border text-left transition-all ${!isDynamic ? 'border-[var(--secondary)] bg-[var(--secondary)] bg-opacity-10' : 'border-[var(--border-color)] opacity-70 cursor-pointer hover:border-[var(--secondary)]'}`}
            style={{ padding: '1rem', borderRadius: '0.75rem', borderWidth: '1px', borderStyle: 'solid', textAlign: 'left', borderColor: !isDynamic ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.1)', background: !isDynamic ? 'rgba(236, 72, 153, 0.1)' : 'transparent' }}
          >
            <h4 className="font-bold text-[var(--text-main)] mb-1" style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Estático (Recomendado)</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              La información cruda se graba en los píxeles. Funciona offline, pero no ofrece métricas.
            </p>
          </button>
        </div>
      </div>

      <div className="animate-fade-in">
        {type === 'URL' && (
          <div>
            <Input
              label="URL de Destino"
              placeholder="https://ejemplo.com"
              value={contentData.url || ''}
              onChange={handleURLChange}
            />
            <p className="text-xs text-[var(--text-muted)] mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              El QR generado usará un enlace dinámico corto que apuntará a esta URL.
            </p>
          </div>
        )}

        {type === 'TEXT' && (
          <div>
            <label className="input-label" style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block' }}>Texto</label>
            <textarea
              className="input w-full h-32 resize-none"
              style={{ width: '100%', height: '8rem', resize: 'none' }}
              placeholder="Escribe el mensaje aquí..."
              value={contentData.text || ''}
              onChange={(e) => setContentData({ text: e.target.value })}
            />
          </div>
        )}

        {type === 'EMAIL' && (
          <div className="flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="Correo Destino"
              placeholder="ejemplo@correo.com"
              value={contentData.email || ''}
              onChange={(e) => setContentData({ ...contentData, email: e.target.value })}
            />
            <Input
              label="Asunto"
              placeholder="Hola..."
              value={contentData.subject || ''}
              onChange={(e) => setContentData({ ...contentData, subject: e.target.value })}
            />
            <div>
              <label className="input-label" style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block' }}>Mensaje</label>
              <textarea
                className="input w-full h-24 resize-none"
                style={{ width: '100%', height: '6rem', resize: 'none' }}
                placeholder="Escribe el mensaje..."
                value={contentData.message || ''}
                onChange={(e) => setContentData({ ...contentData, message: e.target.value })}
              />
            </div>
          </div>
        )}

        {type === 'VCARD' && (
          <div className="flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
              <Input
                label="Nombre"
                value={contentData.firstName || ''}
                onChange={(e) => setContentData({ ...contentData, firstName: e.target.value })}
              />
              <Input
                label="Apellido"
                value={contentData.lastName || ''}
                onChange={(e) => setContentData({ ...contentData, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Teléfono"
              value={contentData.phone || ''}
              onChange={(e) => setContentData({ ...contentData, phone: e.target.value })}
            />
            <Input
              label="Email"
              value={contentData.vcardEmail || ''}
              onChange={(e) => setContentData({ ...contentData, vcardEmail: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
              <Input
                label="Empresa"
                value={contentData.company || ''}
                onChange={(e) => setContentData({ ...contentData, company: e.target.value })}
              />
              <Input
                label="Puesto"
                value={contentData.job || ''}
                onChange={(e) => setContentData({ ...contentData, job: e.target.value })}
              />
            </div>
          </div>
        )}

        {type === 'WIFI' && (
          <div className="flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="Nombre de la Red (SSID)"
              value={contentData.ssid || ''}
              onChange={(e) => setContentData({ ...contentData, ssid: e.target.value })}
            />
            <Input
              label="Contraseña"
              type="password"
              value={contentData.password || ''}
              onChange={(e) => setContentData({ ...contentData, password: e.target.value })}
            />
            <div className="flex gap-4 items-center" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Oculta</label>
              <input
                type="checkbox"
                checked={contentData.hidden || false}
                onChange={(e) => setContentData({ ...contentData, hidden: e.target.checked })}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContentPanel;
