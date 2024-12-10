import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          <img 
            src="/tregua-logo-white.png" 
            alt="Tregua"
            className="h-12 opacity-80"
          />
          
          <div className="w-full max-w-md flex flex-col items-center space-y-6 text-neutral/80">
            <div className="flex items-center space-x-2 hover:text-light transition-colors">
              <MapPin className="h-4 w-4" />
              <p className="text-sm tracking-wide">Camino Villarrica-Pucón Km 2, Villarrica, Chile</p>
            </div>
            
            <div className="flex items-center space-x-2 hover:text-light transition-colors">
              <Phone className="h-4 w-4" />
              <a href="tel:+56452419200" className="text-sm tracking-wide">
                +56 45 241 9200
              </a>
            </div>
            
            <div className="flex items-center space-x-2 hover:text-light transition-colors">
              <Mail className="h-4 w-4" />
              <a href="mailto:contacto@tregua.cl" className="text-sm tracking-wide">
                contacto@tregua.cl
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral/10 w-full text-center">
            <p className="text-xs text-neutral/60">
              © {new Date().getFullYear()} Tregua. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}