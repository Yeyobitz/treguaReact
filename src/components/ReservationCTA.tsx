import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { Calendar } from 'lucide-react';

export function ReservationCTA() {
  const { smoothNavigate } = useSmoothScroll();

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-serif text-light mb-6">Reserve su Experiencia</h3>
          <p className="text-lg text-neutral leading-relaxed mb-12">
            En Tregua, cada comida es una experiencia única. Nuestro ambiente acogedor, 
            servicio excepcional y cocina innovadora se combinan para crear momentos memorables. 
            Reserve su mesa y permítanos ser parte de su próxima celebración especial.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => smoothNavigate('/reservas')}
              className="inline-flex items-center px-8 py-3 bg-accent text-light rounded-full hover:bg-accent/90 transition-colors group"
            >
              <Calendar className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform" />
              <span className="text-sm tracking-wide">Reservar Mesa</span>
            </button>
            
            <button
              onClick={() => smoothNavigate('/platos')}
              className="inline-flex items-center px-8 py-3 border border-neutral/20 text-light rounded-full hover:bg-light/5 transition-colors text-sm tracking-wide"
            >
              Ver Menú
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}