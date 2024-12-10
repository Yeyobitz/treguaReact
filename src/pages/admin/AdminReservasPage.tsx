import { useEffect, useState } from 'react';
import { AdminReservationList } from '../../components/reservations/AdminReservationList';
import { ReservationCalendar } from '../../components/admin/ReservationCalendar';
import { useReservationStore } from '../../stores/useReservationStore';
import { isSameDay } from 'date-fns';

export function AdminReservasPage() {
  const { fetchReservations, reservations, loading, error } = useReservationStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const filteredReservations = selectedDate
    ? reservations.filter(reservation => 
        isSameDay(new Date(reservation.date), selectedDate)
      )
    : reservations;

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6">
          {/* Calendar Section */}
          <div className="w-full max-w-3xl mx-auto">
            <ReservationCalendar
              reservations={reservations}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>

          {/* Reservations List Section */}
          <div className="w-full">
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
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}