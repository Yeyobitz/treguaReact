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
const DishDetail = lazy(() => import('./components/DishDetail'));
const ReservasPage = lazy(() => import('./pages/ReservasPage'));
const PlatosPage = lazy(() => import('./pages/PlatosPage'));
const NosotrosPage = lazy(() => import('./pages/NosotrosPage'));
const ContactoPage = lazy(() => import('./pages/ContactoPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminReservasPage = lazy(() => import('./pages/admin/AdminReservasPage'));
const AdminDishesPage = lazy(() => import('./pages/admin/AdminDishesPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

// Componente de carga
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
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
            <Route path="/platos/:id" element={
              <>
                <Header />
                <DishDetail />
                <Footer />
              </>
            } />
            <Route path="/reservas" element={
              <>
                <Header />
                <ReservasPage />
                <Footer />
              </>
            } />
            <Route path="/platos" element={
              <>
                <Header />
                <PlatosPage />
                <Footer />
              </>
            } />
            <Route path="/nosotros" element={
              <>
                <Header />
                <NosotrosPage />
                <Footer />
              </>
            } />
            <Route path="/contacto" element={
              <>
                <Header />
                <ContactoPage />
                <Footer />
              </>
            } />

            {/* Auth routes */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
           
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole={['admin', 'manager', 'crew']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="reservas" element={<AdminReservasPage />} />
              <Route path="platos" element={
                <ProtectedRoute requiredRole={['admin', 'manager']}>
                  <AdminDishesPage />
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