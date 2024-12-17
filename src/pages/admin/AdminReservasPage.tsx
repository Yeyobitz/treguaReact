import { useEffect, useState } from 'react';
import { AdminReservationList } from '../../components/reservations/AdminReservationList';
import { ReservationCalendar } from '../../components/admin/ReservationCalendar';
import { useReservationStore } from '../../stores/useReservationStore';
import { isSameDay } from 'date-fns';
import { Search, Filter, Calendar, X, FileDown } from 'lucide-react';
import { Reservation } from '../../types/reservation';
import { exportReservationsToPDF } from '../../services/pdfExport';
import { useAuth } from '../../hooks/useAuth';

export function AdminReservasPage() {
  const { fetchReservations, reservations, loading, error } = useReservationStore();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Reservation['status'] | 'all'>('all');
  const [showCalendar, setShowCalendar] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const clearFilters = () => {
    setSelectedDate(null);
    setSearchTerm('');
    setStatusFilter('all');
  };

  const hasActiveFilters = selectedDate !== null || searchTerm !== '' || statusFilter !== 'all';

  const filteredReservations = reservations
    .filter(reservation => {
      // Filtro por fecha
      if (selectedDate) {
        const [year, month, day] = reservation.date.split('-').map(Number);
        const reservationDate = new Date(year, month - 1, day);
        if (!isSameDay(reservationDate, selectedDate)) return false;
      }
      
      // Filtro por estado
      if (statusFilter !== 'all' && reservation.status !== statusFilter) return false;
      
      // Filtro por búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          reservation.name.toLowerCase().includes(searchLower) ||
          reservation.email.toLowerCase().includes(searchLower) ||
          reservation.phone.includes(searchTerm)
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleExportPDF = () => {
    try {
      exportReservationsToPDF(filteredReservations);
      showToast('Reporte generado exitosamente');
    } catch (error) {
      showToast('Error al generar el reporte', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-light dark:bg-primary/95">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panel Izquierdo: Filtros y Calendario */}
          <div className="lg:w-[400px] space-y-6">
            {/* Header y Filtros */}
            <div className="bg-white dark:bg-primary/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-serif text-primary dark:text-light">Filtros</h1>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Limpiar
                    </button>
                  )}
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-light hover:bg-primary/90 dark:bg-light dark:text-primary dark:hover:bg-light/90 transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    Exportar
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Buscador */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 dark:text-light/40" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-light/50 dark:bg-primary/30 border border-neutral/10 dark:border-light/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm text-primary dark:text-light placeholder-primary/40 dark:placeholder-light/40"
                  />
                </div>

                {/* Filtro de Estado */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 dark:text-light/40" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Reservation['status'] | 'all')}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-light/50 dark:bg-primary/30 border border-neutral/10 dark:border-light/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm text-primary dark:text-light appearance-none cursor-pointer"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="confirmed">Confirmadas</option>
                    <option value="cancelled">Canceladas</option>
                  </select>
                </div>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-light/50 dark:bg-primary/30 rounded-lg p-2">
                    <p className="text-xs text-primary/60 dark:text-light/60">Pendientes</p>
                    <p className="text-lg font-medium text-primary dark:text-light">
                      {reservations.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                  <div className="bg-light/50 dark:bg-primary/30 rounded-lg p-2">
                    <p className="text-xs text-primary/60 dark:text-light/60">Confirmadas</p>
                    <p className="text-lg font-medium text-primary dark:text-light">
                      {reservations.filter(r => r.status === 'confirmed').length}
                    </p>
                  </div>
                  <div className="bg-light/50 dark:bg-primary/30 rounded-lg p-2">
                    <p className="text-xs text-primary/60 dark:text-light/60">Canceladas</p>
                    <p className="text-lg font-medium text-primary dark:text-light">
                      {reservations.filter(r => r.status === 'cancelled').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendario */}
            <div className="bg-white dark:bg-primary/50 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-primary dark:bg-primary/80">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif text-light">Calendario</h2>
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="p-1 rounded-lg text-light hover:text-accent transition-colors"
                  >
                    {showCalendar ? <X className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {showCalendar && (
                <ReservationCalendar
                  reservations={reservations}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              )}
            </div>
          </div>

          {/* Panel Derecho: Lista de Reservas */}
          <div className="flex-1">
            <div className="bg-white dark:bg-primary/50 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-serif text-primary dark:text-light mb-6">
                Reservas {filteredReservations.length > 0 && `(${filteredReservations.length})`}
              </h2>

              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent" />
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <AdminReservationList 
                  reservations={filteredReservations}
                  userRole={user?.role || 'staff'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}