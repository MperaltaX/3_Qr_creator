import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { QrCode } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Bienvenido');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <Card className="w-full max-w-md p-8 glass" style={{ width: '100%', maxWidth: '28rem', padding: '2rem' }}>
        <div className="flex flex-col items-center mb-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div className="p-3 bg-[var(--primary)] bg-opacity-20 rounded-full text-[var(--primary)] mb-4" style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '9999px', color: 'var(--primary)', marginBottom: '1rem' }}>
            <QrCode size={40} />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Login</h1>
          <p className="text-[var(--text-muted)] text-center mt-2" style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
            Ingresa con tus credenciales de administrador para gestionar la plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input 
            label="Email" 
            type="email" 
            placeholder="admin@ejemplo.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full mt-2" style={{ width: '100%', marginTop: '0.5rem' }} disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
