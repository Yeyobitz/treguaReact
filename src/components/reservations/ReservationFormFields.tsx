import { ReservationFormData } from '../../types/reservation';
import { format } from 'date-fns';

interface ReservationFormFieldsProps {
  formData: ReservationFormData;
  errors: Record<string, string>;
  onChange: (field: keyof ReservationFormData, value: any) => void;
}

export function ReservationFormFields({ formData, errors, onChange }: ReservationFormFieldsProps) {
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
            onBlur={(e) => onChange('name', e.target.value)}
            className={`mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
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
            onBlur={(e) => onChange('email', e.target.value)}
            className={`mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
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
            onBlur={(e) => onChange('phone', e.target.value)}
            className={`mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent ${
              errors.phone ? 'border-red-500' : ''
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
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
            onBlur={(e) => onChange('guests', Number(e.target.value))}
            className={`mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent ${
              errors.guests ? 'border-red-500' : ''
            }`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'persona' : 'personas'}
              </option>
            ))}
          </select>
          {errors.guests && (
            <p className="mt-1 text-sm text-red-500">{errors.guests}</p>
          )}
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
            onBlur={(e) => onChange('date', e.target.value)}
            className={`mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent ${
              errors.date ? 'border-red-500' : ''
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date}</p>
          )}
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
            onBlur={(e) => onChange('time', e.target.value)}
            className={`mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent ${
              errors.time ? 'border-red-500' : ''
            }`}
          >
            <option value="">Seleccionar hora</option>
            {['12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="mt-1 text-sm text-red-500">{errors.time}</p>
          )}
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
          onBlur={(e) => onChange('notes', e.target.value)}
          className={`mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent ${
            errors.notes ? 'border-red-500' : ''
          }`}
          placeholder="Alergias, preferencias especiales, ocasión especial..."
        ></textarea>
        {errors.notes && (
          <p className="mt-1 text-sm text-red-500">{errors.notes}</p>
        )}
      </div>
    </>
  );
}