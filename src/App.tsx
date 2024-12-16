import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { FeaturedDishes } from './components/FeaturedDishes';
import { ReservationCTA } from './components/ReservationCTA';
import { DishDetail } from './components/DishDetail';
import { Footer } from './components/Footer';
import { ReservasPage } from './pages/ReservasPage';
import { PlatosPage } from './pages/PlatosPage';
import { NosotrosPage } from './pages/NosotrosPage';
import { ContactoPage } from './pages/ContactoPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminReservasPage } from './pages/admin/AdminReservasPage';
import { AdminDishesPage } from './pages/admin/AdminDishesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="reservas" element={<AdminReservasPage />} />
            <Route path="platos" element={<AdminDishesPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;