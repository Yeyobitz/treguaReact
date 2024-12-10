import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateInvitation, markInvitationAsUsed } from '../services/invitations';
import { createUser } from '../services/users';
import { Toast } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate invitation
      const invitation = await validateInvitation(inviteCode);
      if (!invitation) {
        showToast('Código de invitación inválido o expirado', 'error');
        setLoading(false);
        return;
      }

      // Create user
      await createUser({
        email,
        password,
        role: invitation.role
      });

      // Mark invitation as used
      await markInvitationAsUsed(invitation.id);

      showToast('Registro exitoso. Ya puedes iniciar sesión.');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (error: any) {
      showToast(error.message || 'Error al registrar usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif text-primary">
            Registro de Usuario
          </h2>
          <p className="mt-2 text-center text-sm text-primary/60">
            Ingresa tu código de invitación para registrarte
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="invite-code" className="sr-only">
                Código de invitación
              </label>
              <input
                id="invite-code"
                name="invite-code"
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral bg-light/50 placeholder-primary/60 text-primary rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="Código de invitación"
              />
            </div>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral bg-light/50 placeholder-primary/60 text-primary focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral bg-light/50 placeholder-primary/60 text-primary rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-light bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    </div>
  );
}