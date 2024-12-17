import { useEffect, useState } from 'react';
import { AdminReservationList } from '../../components/reservations/AdminReservationList';
import { ReservationCalendar } from '../../components/admin/ReservationCalendar';
import { useReservationStore } from '../../stores/useReservationStore';
import { isSameDay, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { Search, Filter, Calendar, X, FileDown } from 'lucide-react';
import { Reservation } from '../../types/reservation';
import { exportReservationsToPDF } from '../../services/pdfExport';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filters: ExportFilters) => void;
  currentFilters: {
    date: Date | null;
    status: Reservation['status'] | 'all';
  };
}

interface ExportFilters {
  dateRange: 'all' | 'custom' | 'month';
  startDate: string;
  endDate: string;
  status: Reservation['status'] | 'all';
}

function ExportModal({ isOpen, onClose, onExport, currentFilters }: ExportModalProps) {
  const [filters, setFilters] = useState<ExportFilters>({
    dateRange: currentFilters.date ? 'custom' : 'all',
    startDate: currentFilters.date ? currentFilters.date.toISOString().split('T')[0] : '',
    endDate: currentFilters.date ? currentFilters.date.toISOString().split('T')[0] : '',
    status: currentFilters.status
  });

  const handleDateRangeChange = (range: 'all' | 'custom' | 'month') => {
    if (range === 'month') {
      const today = new Date();
      setFilters(prev => ({
        ...prev,
        dateRange: range,
        startDate: startOfMonth(today).toISOString().split('T')[0],
        endDate: endOfMonth(today).toISOString().split('T')[0]
      }));
    } else {
      setFilters(prev => ({ ...prev, dateRange: range }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-primary/95 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-medium text-primary dark:text-light">
            Exportar Reservas
          </h3>
          <button
            onClick={onClose}
            className="text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-2">
              Rango de Fechas
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value as 'all' | 'custom' | 'month')}
              className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50 mb-4"
            >
              <option value="all">Todas las fechas</option>
              <option value="month">Mes actual</option>
              <option value="custom">Rango personalizado</option>
            </select>

            {filters.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-primary/60 dark:text-light/60 mb-1">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-primary/60 dark:text-light/60 mb-1">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-2">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as Reservation['status'] | 'all' }))}
              className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-primary/80 dark:text-light/80 hover:text-primary dark:hover:text-light"
          >
            Cancelar
          </button>
          <button
            onClick={() => onExport(filters)}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90"
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminReservasPage() {
  const { fetchReservations, reservations, loading, error } = useReservationStore();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Reservation['status'] | 'all'>('all');
  const [showCalendar, setShowCalendar] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

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

  const handleExport = (filters: ExportFilters) => {
    try {
      let reservationsToExport = [...reservations];

      // Aplicar filtros
      if (filters.dateRange !== 'all') {
        const startDate = parseISO(filters.startDate);
        const endDate = parseISO(filters.endDate);
        
        reservationsToExport = reservationsToExport.filter(reservation => {
          const [year, month, day] = reservation.date.split('-').map(Number);
          const reservationDate = new Date(year, month - 1, day);
          return reservationDate >= startDate && reservationDate <= endDate;
        });
      }

      if (filters.status !== 'all') {
        reservationsToExport = reservationsToExport.filter(
          reservation => reservation.status === filters.status
        );
      }

      exportReservationsToPDF(reservationsToExport, filters);
      showToast('Reporte generado exitosamente');
      setShowExportModal(false);
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
                    onClick={() => setShowExportModal(true)}
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

      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          currentFilters={{
            date: selectedDate,
            status: statusFilter
          }}
        />
      )}
    </div>
  );
}