import { ReservationFormData } from '../../types/reservation';
import { format } from 'date-fns';

interface ReservationFormFieldsProps {
  formData: ReservationFormData;
  onChange: (field: keyof ReservationFormData, value: any) => void;
}

export function ReservationFormFields({ formData, onChange }: ReservationFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary/80">
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary/80">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primary/80">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-primary/80">
            Número de personas
          </label>
          <select
            id="guests"
            required
            value={formData.guests}
            onChange={(e) => onChange('guests', Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'persona' : 'personas'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-primary/80">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            required
            min={format(new Date(), 'yyyy-MM-dd')}
            value={formData.date}
            onChange={(e) => onChange('date', e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-primary/80">
            Hora
          </label>
          <select
            id="time"
            required
            value={formData.time}
            onChange={(e) => onChange('time', e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent"
          >
            <option value="">Seleccionar hora</option>
            {['12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-primary/80">
          Notas adicionales
        </label>
        <textarea
          id="notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          className="mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent"
          placeholder="Alergias, preferencias especiales, ocasión especial..."
        ></textarea>
      </div>
    </>
  );
}