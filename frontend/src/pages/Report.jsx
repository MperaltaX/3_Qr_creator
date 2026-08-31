import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import QRCodeStyling from 'qr-code-styling';

const Report = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef(null);
  const qrCodeInstance = useRef(null);

  const getFinalData = (qrInfo) => {
    if (qrInfo.is_dynamic && qrInfo.type !== 'WIFI') {
      return `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}/q/${qrInfo.short_id}`;
    }
    const type = qrInfo.type;
    const content = qrInfo.content_data || {};
    if (type === 'URL') return content.url || 'https://ejemplo.com';
    if (type === 'TEXT') return content.text || '';
    if (type === 'EMAIL') return `mailto:${content.email||''}?subject=${encodeURIComponent(content.subject||'')}&body=${encodeURIComponent(content.message||'')}`;
    if (type === 'VCARD') return ['BEGIN:VCARD','VERSION:3.0',`N:${content.lastName||''};${content.firstName||''};;;`,`FN:${content.firstName||''} ${content.lastName||''}`,`ORG:${content.company||''}`,`TITLE:${content.job||''}`,`TEL;TYPE=WORK,VOICE:${content.phone||''}`,`EMAIL:${content.vcardEmail||''}`,'END:VCARD'].join('\n');
    if (type === 'WIFI') return `WIFI:S:${content.ssid||''};T:WPA;P:${content.password||''};H:${content.hidden ? 'true' : 'false'};;`;
    return 'https://ejemplo.com';
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(`/analytics/${id}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  useEffect(() => {
    if (data && data.qrInfo && qrRef.current) {
      const finalData = getFinalData(data.qrInfo);

      const defaultDesign = {
        dotsOptions: { color: '#000000', type: 'rounded' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#000000', type: 'extra-rounded' },
        cornersDotOptions: { color: '#000000', type: 'dot' },
      };

      const design = {
        ...defaultDesign,
        ...(data.qrInfo.design_settings || {}),
        data: finalData,
        width: 300,
        height: 300,
        type: 'svg'
      };

      if (!qrCodeInstance.current) {
        qrCodeInstance.current = new QRCodeStyling(design);
        qrRef.current.innerHTML = '';
        qrCodeInstance.current.append(qrRef.current);
      } else {
        qrCodeInstance.current.update(design);
      }
    }
  }, [data]);

  const onDownload = (ext) => {
    if (data && data.qrInfo) {
      const finalData = getFinalData(data.qrInfo);

      const defaultDesign = {
        dotsOptions: { color: '#000000', type: 'rounded' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { color: '#000000', type: 'extra-rounded' },
        cornersDotOptions: { color: '#000000', type: 'dot' },
      };

      const dlDesign = {
        ...defaultDesign,
        ...(data.qrInfo.design_settings || {}),
        data: finalData,
        width: 1024,
        height: 1024
      };
      
      const dlInstance = new QRCodeStyling(dlDesign);
      dlInstance.download({ name: data.qrInfo.name || 'QR', extension: ext });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando reporte...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Error al cargar el reporte</div>;
  }

  // Helpers para porcentajes
  const totalScans = data.qrInfo.total_scans || 1; // evitar division por 0
  
  const renderBars = (obj) => {
    if (!obj || Object.keys(obj).length === 0) return <p className="text-sm text-[var(--text-muted)]">No hay datos</p>;
    
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1]) // mayor a menor
      .slice(0, 5) // top 5
      .map(([key, value]) => {
        const percentage = Math.round((value / totalScans) * 100);
        return (
          <React.Fragment key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>{key || 'Desconocido'}</span><span>{percentage}% ({value})</span>
            </div>
            <div className="w-full bg-[var(--bg-panel-hover)] h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-[var(--primary)] h-full" style={{ width: `${percentage}%` }}></div>
            </div>
          </React.Fragment>
        );
      });
  };

  const topDevice = Object.entries(data.devices || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="container mt-8 pb-12" style={{ width: '100%', maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', paddingBottom: '3rem' }}>
      <div className="flex items-center justify-between mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard">
            <Button variant="ghost" style={{ padding: '0.5rem' }}>
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontSize: '1.875rem', fontWeight: 700 }}>{data.qrInfo.name}</h1>
            <p className="text-[var(--text-muted)]" style={{ color: 'var(--text-muted)' }}>Reporte de Rendimiento</p>
          </div>
        </div>

        {/* Visualización del QR */}
        <div className="card flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <div className="rounded-lg overflow-hidden bg-white" style={{ width: '80px', height: '80px', position: 'relative', borderRadius: '0.5rem', background: '#fff' }}>
            <div ref={qrRef} style={{ width: '300px', height: '300px', transform: 'scale(0.2666)', transformOrigin: 'top left' }} />
          </div>
          <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Button variant="secondary" className="text-xs py-1 px-3" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }} onClick={() => onDownload('png')}>
              <Download size={14} className="mr-1" style={{ marginRight: '0.25rem' }} /> PNG
            </Button>
            {data.qrInfo.is_dynamic && data.qrInfo.type !== 'WIFI' && (
              <a href={`${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}/q/${data.qrInfo.short_id}`} target="_blank" rel="noreferrer">
                <Button variant="ghost" className="text-xs py-1 px-3 w-full" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', width: '100%' }}>
                  <ExternalLink size={14} className="mr-1" style={{ marginRight: '0.25rem' }} /> Enlace
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {!data.qrInfo.is_dynamic || data.qrInfo.type === 'WIFI' ? (
        <Card className="text-center p-12 opacity-80" style={{ padding: '3rem', textAlign: 'center', opacity: 0.8 }}>
          <h2 className="text-xl font-bold mb-2 text-[var(--secondary)]" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--secondary)' }}>Modo Estático</h2>
          <p className="text-[var(--text-muted)]" style={{ color: 'var(--text-muted)' }}>La información está grabada directamente en la imagen del QR. Al no usar servidores intermedios, las métricas de escaneo no están disponibles para este código.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <Card>
              <p className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Escaneos</p>
              <p className="text-3xl font-bold mt-2" style={{ fontSize: '1.875rem', fontWeight: 700, marginTop: '0.5rem' }}>{data.qrInfo.total_scans}</p>
            </Card>
            <Card>
              <p className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Escaneos Hoy</p>
              <p className="text-3xl font-bold mt-2" style={{ fontSize: '1.875rem', fontWeight: 700, marginTop: '0.5rem' }}>{data.timeline[data.timeline.length - 1]?.scans || 0}</p>
            </Card>
            <Card>
              <p className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Top Dispositivo</p>
              <p className="text-3xl font-bold mt-2" style={{ fontSize: '1.875rem', fontWeight: 700, marginTop: '0.5rem' }}>{topDevice}</p>
            </Card>
          </div>

          <Card className="mb-8">
            <h2 className="text-xl font-bold mb-6" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Evolución de Escaneos (Últimos 7 días)</h2>
            <div className="h-80 w-full" style={{ height: '20rem', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255, 255, 255, 0.2)', color: 'var(--text-main)', borderRadius: '0.5rem' }}
                  />
                  <Line type="monotone" dataKey="scans" stroke="var(--primary)" strokeWidth={3} dot={{ r: 6, fill: 'var(--primary)', stroke: 'rgba(255,255,255,0.5)' }} activeDot={{ r: 8, fill: 'var(--secondary)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card>
              <h2 className="text-lg font-bold mb-4" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Por Sistema Operativo</h2>
              <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {renderBars(data.os)}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Report;
