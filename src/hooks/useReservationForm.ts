import { useState } from 'react';
import { ReservationFormData, reservationSchema } from '../types/reservation';
import { useReservationStore } from '../stores/useReservationStore';

const initialFormData: ReservationFormData = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  notes: '',
};

interface FormErrors {
  [key: string]: string;
}

export function useReservationForm() {
  const addReservation = useReservationStore((state) => state.addReservation);
  const [formData, setFormData] = useState<ReservationFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (field: keyof ReservationFormData, value: any) => {
    try {
      const schema = reservationSchema.pick({ [field]: true });
      schema.parse({ [field]: value });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    } catch (error: any) {
      if (error.errors?.[0]) {
        setErrors(prev => ({
          ...prev,
          [field]: error.errors[0].message
        }));
      }
      return false;
    }
  };

  const handleChange = (field: keyof ReservationFormData, value: any) => {
    const newValue = field === 'guests' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [field]: newValue }));
    validateField(field, newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar todos los campos
      const validationResult = reservationSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const newErrors: FormErrors = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        throw new Error('Error de validación');
      }
      
      // Si la validación pasa, enviar la reserva
      await addReservation(formData);
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      if (error.message === 'Error de validación') {
        throw error;
      }
      throw new Error('Error al realizar la reserva');
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
  };
}