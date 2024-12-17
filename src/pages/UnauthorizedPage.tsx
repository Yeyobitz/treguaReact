import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Shield className="w-16 h-16 text-accent" />
        </div>
        
        <h1 className="text-3xl font-serif text-light mb-4">
          Acceso No Autorizado
        </h1>
        
        <p className="text-light/60 mb-8 max-w-md">
          No tienes los permisos necesarios para acceder a esta sección. 
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al inicio
        </button>
      </div>
    </div>
  );
} 