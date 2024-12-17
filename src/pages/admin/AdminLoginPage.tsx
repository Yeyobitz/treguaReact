import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLockout = localStorage.getItem('adminLoginLockout');
    if (savedLockout) {
      const lockoutTime = new Date(savedLockout);
      if (lockoutTime > new Date()) {
        setLockoutUntil(lockoutTime);
      } else {
        localStorage.removeItem('adminLoginLockout');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si está bloqueado
    if (lockoutUntil && lockoutUntil > new Date()) {
      const minutesLeft = Math.ceil((lockoutUntil.getTime() - new Date().getTime()) / 60000);
      setError(`Demasiados intentos. Por favor espera ${minutesLeft} minutos.`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginAttempts(0);
      localStorage.removeItem('adminLoginLockout');
      navigate('/admin/reservas');
    } catch (err: any) {
      console.error('Login error:', err);
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Bloquear después de 5 intentos
      if (newAttempts >= 5) {
        const lockoutTime = new Date(new Date().getTime() + 15 * 60000); // 15 minutos
        setLockoutUntil(lockoutTime);
        localStorage.setItem('adminLoginLockout', lockoutTime.toISOString());
        setError('Demasiados intentos. Por favor espera 15 minutos.');
      } else {
        setError('Credenciales inválidas');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif text-primary">
            Panel Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-primary/60">
            Ingrese sus credenciales para continuar
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral bg-light/50 placeholder-primary/60 text-primary rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral bg-light/50 placeholder-primary/60 text-primary rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-light bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}