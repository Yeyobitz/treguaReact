import { useState } from 'react';
import { ReservationFormData } from '../types/reservation';
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

export function useReservationForm() {
  const addReservation = useReservationStore((state) => state.addReservation);
  const [formData, setFormData] = useState<ReservationFormData>(initialFormData);

  const handleChange = (field: keyof ReservationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addReservation(formData);
    setFormData(initialFormData);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
}