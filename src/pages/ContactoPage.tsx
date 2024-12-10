import { MapPin, Phone, Mail } from 'lucide-react';

export function ContactoPage() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80"
            alt="Contacto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-light mb-8">
            Contacto
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-light/90 leading-relaxed">
            Estamos aquí para responder a todas sus consultas.
          </p>
        </div>
      </div>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-serif text-primary mb-8">Información de Contacto</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-accent" />
                    <p className="text-primary/80">Camino Villarrica-Pucón Km 2, Villarrica, Chile</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-accent" />
                    <p className="text-primary/80">+56 45 241 9200</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-accent" />
                    <p className="text-primary/80">contacto@tregua.cl</p>
                  </div>
                </div>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary/80">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
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
                    className="mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary/80">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-neutral bg-light/50 shadow-sm focus:border-accent focus:ring-accent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-accent text-light px-8 py-3 rounded-full hover:bg-accent/90 transition-colors text-sm tracking-wide"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-primary mb-8">Ubicación</h2>
              <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3088.1293815668687!2d-72.2265038240445!3d-39.28531627164375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x961463acbda5f567%3A0x721e916188bc5639!2sMasago%20Sushi%20Bar!5e0!3m2!1ses-419!2scl!4v1733814355815!5m2!1ses-419!2scl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Tregua"
                  className="w-full h-full"
                />
              </div>
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-serif text-primary mb-4">Horarios de Atención</h3>
                <div className="grid grid-cols-2 gap-4 text-primary/80">
                  <div>
                    <p className="font-medium">Almuerzo</p>
                    <p>Martes a Domingo</p>
                    <p>12:30 - 15:30</p>
                  </div>
                  <div>
                    <p className="font-medium">Cena</p>
                    <p>Martes a Sábado</p>
                    <p>19:30 - 23:30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}