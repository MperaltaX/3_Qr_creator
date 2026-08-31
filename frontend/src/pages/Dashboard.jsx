import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { QrCode, TrendingUp, Users, Plus, Download, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [qrs, setQrs] = useState([]);
  const [overview, setOverview] = useState({ totalQRs: 0, totalScans: 0, recentScans: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qrsRes, overviewRes] = await Promise.all([
          api.get('/qr'),
          api.get('/analytics/overview')
        ]);
        setQrs(qrsRes.data.data);
        setOverview(overviewRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este código QR? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/qr/${id}`);
        setQrs(qrs.filter(qr => qr.id !== id));
        toast.success('QR eliminado exitosamente');
        // Optionally update overview numbers
        setOverview(prev => ({
          ...prev,
          totalQRs: prev.totalQRs > 0 ? prev.totalQRs - 1 : 0
        }));
      } catch (error) {
        console.error('Error deleting QR', error);
        toast.error('Error al eliminar el QR');
      }
    }
  };

  return (
    <div className="container mt-8" style={{ width: '100%', maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-3xl font-bold" style={{ fontSize: '1.875rem', fontWeight: 700 }}>Dashboard</h1>
        <Link to="/create">
          <Button>
            <Plus size={18} /> Crear QR
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="p-4 bg-[var(--primary)] bg-opacity-20 rounded-full text-[var(--primary)]" style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '9999px', color: 'var(--primary)' }}>
            <QrCode size={32} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total QRs</p>
            <p className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{loading ? '-' : overview.totalQRs}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="p-4 bg-emerald-500 bg-opacity-20 rounded-full text-emerald-500" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '9999px', color: '#10b981' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Escaneos</p>
            <p className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{loading ? '-' : overview.totalScans}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="p-4 bg-violet-500 bg-opacity-20 rounded-full text-violet-500" style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '9999px', color: '#8b5cf6' }}>
            <Users size={32} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)]" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Escaneos 7D</p>
            <p className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{loading ? '-' : overview.recentScans}</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Tus Códigos QR</h2>
        <div className="overflow-x-auto" style={{ overflowX: 'auto' }}>
          <table className="w-full text-left border-collapse" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="border-b border-[var(--border-color)]" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th className="py-3 px-4 text-sm text-[var(--text-muted)] font-medium" style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Nombre</th>
                <th className="py-3 px-4 text-sm text-[var(--text-muted)] font-medium" style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Tipo</th>
                <th className="py-3 px-4 text-sm text-[var(--text-muted)] font-medium" style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Modo</th>
                <th className="py-3 px-4 text-sm text-[var(--text-muted)] font-medium" style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Escaneos</th>
                <th className="py-3 px-4 text-sm text-[var(--text-muted)] font-medium" style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-[var(--text-muted)]">Cargando...</td>
                </tr>
              ) : qrs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-[var(--text-muted)]">No tienes códigos QR creados. ¡Crea el primero!</td>
                </tr>
              ) : (
                qrs.map(qr => (
                  <tr key={qr.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-panel-hover)] transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="py-3 px-4 font-medium" style={{ padding: '0.75rem 1rem' }}>{qr.name || 'Sin título'}</td>
                    <td className="py-3 px-4" style={{ padding: '0.75rem 1rem' }}><span className="badge badge-neutral">{qr.type}</span></td>
                    <td className="py-3 px-4" style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${qr.is_dynamic ? 'bg-[var(--primary)] bg-opacity-20 text-[var(--primary)]' : 'bg-[var(--secondary)] bg-opacity-20 text-[var(--secondary)]'}`}>
                        {qr.is_dynamic ? 'Dinámico' : 'Estático'}
                      </span>
                    </td>
                    <td className="py-3 px-4" style={{ padding: '0.75rem 1rem' }}>{qr.is_dynamic ? (qr.total_scans || 0) : '-'}</td>
                    <td className="py-3 px-4 flex gap-2" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/report/${qr.id}`}><Button variant="secondary" className="text-xs py-1 px-2" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Reporte</Button></Link>
                      <a href={`${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '')}/q/${qr.short_id}`} target="_blank" rel="noreferrer">
                        <Button variant="ghost" className="text-xs py-1 px-2" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Ver Enlace</Button>
                      </a>
                      <Button variant="ghost" className="text-xs py-1 px-2 text-red-500 hover:text-red-600 hover:bg-red-500 hover:bg-opacity-10" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(qr.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
