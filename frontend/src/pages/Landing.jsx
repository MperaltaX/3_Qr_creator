import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import { QrCode, BarChart3, Edit3, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar Simple */}
      <nav className="flex justify-between items-center p-6 border-b border-[var(--border-color)]" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2 text-xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          <QrCode className="text-[var(--primary)]" />
          <span>QR<span className="text-[var(--primary)]">io</span></span>
        </div>
        <Link to="/login">
          <Button variant="ghost">Ingresar</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
        <div className="max-w-3xl" style={{ maxWidth: '48rem' }}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight" style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.25 }}>
            Códigos QR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(to right, var(--primary), var(--secondary))' }}>Dinámicos</span> que no expiran
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-muted)] mb-10" style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Crea, personaliza y rastrea tus códigos QR en tiempo real. Analíticas avanzadas y editor visual premium en una sola plataforma.
          </p>
          <Link to="/login">
            <Button className="px-8 py-4 text-lg rounded-full" style={{ padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: '9999px' }}>
              Comenzar Ahora
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '6rem', maxWidth: '64rem' }}>
          <div className="flex flex-col items-center text-center p-6 card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem' }}>
            <div className="p-4 bg-[var(--primary)] bg-opacity-20 rounded-2xl text-[var(--primary)] mb-4" style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '1rem', color: 'var(--primary)', marginBottom: '1rem' }}>
              <Edit3 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Editor Visual</h3>
            <p className="text-[var(--text-muted)]" style={{ color: 'var(--text-muted)' }}>Personaliza colores, formas y agrega tu logo en tiempo real.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem' }}>
            <div className="p-4 bg-emerald-500 bg-opacity-20 rounded-2xl text-emerald-500 mb-4" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '1rem', color: '#10b981', marginBottom: '1rem' }}>
              <BarChart3 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Analíticas Avanzadas</h3>
            <p className="text-[var(--text-muted)]" style={{ color: 'var(--text-muted)' }}>Mide escaneos, dispositivos, sistemas operativos y geolocalización.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 card glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem' }}>
            <div className="p-4 bg-violet-500 bg-opacity-20 rounded-2xl text-violet-500 mb-4" style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '1rem', color: '#8b5cf6', marginBottom: '1rem' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Enlaces Dinámicos</h3>
            <p className="text-[var(--text-muted)]" style={{ color: 'var(--text-muted)' }}>Cambia la URL destino en cualquier momento sin reimprimir el QR.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
