import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Reservation } from '../../types/reservation';

interface ReservationCalendarProps {
  reservations: Reservation[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export function ReservationCalendar({ reservations, selectedDate, onSelectDate }: ReservationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(start);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getReservationsForDate = (date: Date) => {
    return reservations.filter(reservation => {
      const reservationDate = parseISO(reservation.date);
      return isSameDay(reservationDate, date);
    });
  };

  const nextMonth = () => setCurrentDate(date => addMonths(date, 1));
  const previousMonth = () => setCurrentDate(date => subMonths(date, 1));

  return (
    <div className="bg-white dark:bg-primary/50 rounded-xl shadow-sm overflow-hidden transition-colors">
      <div className="p-6 bg-primary dark:bg-primary/80">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-1 rounded-lg text-light hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-serif text-light text-center">
            {format(currentMonth[0], 'MMMM yyyy', { locale: es })}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg text-light hover:text-accent transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-primary/60 dark:text-light/60">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {currentMonth.map((date) => {
            const reservationsCount = getReservationsForDate(date).length;
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isCurrentDay = isToday(date);
            
            return (
              <button
                key={date.toString()}
                onClick={() => onSelectDate(date)}
                className={`
                  aspect-square p-1 rounded-lg relative transition-all
                  ${isSelected ? 'bg-accent text-light shadow-md scale-105' : 'hover:bg-primary/5 dark:hover:bg-light/5'}
                  ${isCurrentDay && !isSelected ? 'border-2 border-accent' : ''}
                  dark:text-light
                `}
              >
                <time
                  dateTime={format(date, 'yyyy-MM-dd')}
                  className={`text-sm ${isSelected ? 'font-medium' : ''}`}
                >
                  {format(date, 'd')}
                </time>
                {reservationsCount > 0 && (
                  <div className="absolute bottom-1 right-1">
                    <span 
                      className={`
                        flex h-5 w-5 items-center justify-center rounded-full text-xs
                        ${isSelected ? 'bg-light text-accent' : 'bg-accent text-light'}
                      `}
                    >
                      {reservationsCount}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}