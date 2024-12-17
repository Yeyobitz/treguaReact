import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Story() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 bg-light">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl font-serif text-primary mb-12">Nuestra Historia</h3>
        
        <div className="prose prose-lg mx-auto text-primary/80 leading-relaxed">
          <p className="mb-8">
            En diciembre de 2024, Tregua abrió sus puertas en el corazón de Villarrica, 
            trayendo una propuesta gastronómica única que fusiona la riqueza de los 
            ingredientes locales con técnicas culinarias contemporáneas.
          </p>

          <button 
            onClick={() => navigate('/nosotros')}
            className="inline-flex items-center text-accent hover:text-accent/80 transition-colors group"
          >
            <span className="border-b border-accent group-hover:border-accent/80">
              La historia continúa
            </span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}