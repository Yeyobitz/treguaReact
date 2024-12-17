import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ArrowLeft } from 'lucide-react';

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      showToast('Inicio de sesión exitoso', 'success');
      navigate('/');
    } catch (error: any) {
      showToast(error.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header con botón de volver */}
      <div className="p-6">
        <Link 
          to="/"
          className="inline-flex items-center text-light/80 hover:text-accent transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link 
            to="/"
            className="block text-4xl font-serif text-light text-center mb-12 hover:text-accent transition-colors"
          >
            Tregua
          </Link>

          <div className="bg-light/5 backdrop-blur-sm rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-serif text-light mb-8 text-center">
              Iniciar Sesión
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm text-light/60 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-light/10 border border-light/10 rounded-lg text-light placeholder-light/30 focus:outline-none focus:border-accent/50"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-light/60 mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-light/10 border border-light/10 rounded-lg text-light placeholder-light/30 focus:outline-none focus:border-accent/50"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-light/60 text-sm">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/signup"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 