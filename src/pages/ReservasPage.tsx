import { ReservationForm } from '../components/reservations/ReservationForm';

export function ReservasPage() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
            alt="Reservas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-light mb-8">
            Reservas
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-light/90 leading-relaxed">
            Reserve su mesa y disfrute de una experiencia gastronómica única en un ambiente acogedor y elegante.
          </p>
        </div>
      </div>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-serif text-primary mb-12 text-center">Horarios</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="text-center">
                <h3 className="text-xl font-serif text-primary mb-4">Almuerzo</h3>
                <p className="text-primary/80">Martes a Domingo</p>
                <p className="text-primary/80">12:30 - 15:30</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif text-primary mb-4">Cena</h3>
                <p className="text-primary/80">Martes a Sábado</p>
                <p className="text-primary/80">19:30 - 23:30</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-serif text-primary mb-8 text-center">Hacer una Reserva</h2>
            <ReservationForm />
          </div>
        </div>
      </section>
    </div>
  );
}