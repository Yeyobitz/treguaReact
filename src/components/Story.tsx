import { ArrowRight } from 'lucide-react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

export function Story() {
  const { smoothNavigate } = useSmoothScroll();

  return (
    <section className="relative py-20 bg-light">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80')] bg-cover transform -rotate-12"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80')] bg-cover transform rotate-6"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 rounded-full bg-[url('https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&q=80')] bg-cover transform rotate-12"></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl font-serif text-primary mb-12">Nuestra Historia</h3>
        
        <div className="prose prose-lg mx-auto text-primary/80 leading-relaxed">
          <p className="mb-8">
            En diciembre de 2024, Tregua abrió sus puertas en el corazón de Villarrica, 
            trayendo una propuesta gastronómica única que fusiona la riqueza de los 
            ingredientes locales con técnicas culinarias contemporáneas.
          </p>

          <button 
            onClick={() => smoothNavigate('/nosotros')}
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