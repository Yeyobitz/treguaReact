import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import React, { Suspense, lazy } from 'react'

// Componentes de la página principal (carga inmediata)
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { FeaturedDishes } from './components/FeaturedDishes';
import { ReservationCTA } from './components/ReservationCTA';

// Lazy loading de componentes
const DishDetail = lazy(() => import('./components/DishDetail').then(module => ({ default: module.DishDetail })));
const ReservasPage = lazy(() => import('./pages/ReservasPage').then(module => ({ default: module.ReservasPage })));
const PlatosPage = lazy(() => import('./pages/PlatosPage').then(module => ({ default: module.PlatosPage })));
const NosotrosPage = lazy(() => import('./pages/NosotrosPage').then(module => ({ default: module.NosotrosPage })));
const ContactoPage = lazy(() => import('./pages/ContactoPage').then(module => ({ default: module.ContactoPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(module => ({ default: module.AdminLoginPage })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminReservasPage = lazy(() => import('./pages/admin/AdminReservasPage').then(module => ({ default: module.AdminReservasPage })));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage').then(module => ({ default: module.AdminUsersPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(module => ({ default: module.SignupPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));

// Componente de carga
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Layout común para rutas públicas
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className="min-h-screen pt-16">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Página principal */}
            <Route path="/" element={
              <div className="min-h-screen">
                <Header />
                <main>
                  <Hero />
                  <Story />
                  <FeaturedDishes />
                  <ReservationCTA />
                </main>
                <Footer />
              </div>
            } />

            {/* Rutas públicas con layout común */}
            <Route path="/platos/:id" element={<PublicLayout><DishDetail /></PublicLayout>} />
            <Route path="/reservas" element={<PublicLayout><ReservasPage /></PublicLayout>} />
            <Route path="/platos" element={<PublicLayout><PlatosPage /></PublicLayout>} />
            <Route path="/nosotros" element={<PublicLayout><NosotrosPage /></PublicLayout>} />
            <Route path="/contacto" element={<PublicLayout><ContactoPage /></PublicLayout>} />

            {/* Auth routes */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <PublicLayout>
                  <ProfilePage />
                </PublicLayout>
              </ProtectedRoute>
            } />
           
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole={['admin', 'manager', 'crew']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="reservas" element={<AdminReservasPage />} />
              <Route path="platos" element={
                <ProtectedRoute requiredRole={['admin', 'manager']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              } />
              <Route path="usuarios" element={
                <ProtectedRoute requiredRole={['admin', 'manager']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;