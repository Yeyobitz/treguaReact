import { PhotoGrid } from '../components/PhotoGrid';

export function NosotrosPage() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80"
            alt="Sobre Nosotros"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-light mb-8">
            Nuestra Historia
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-light/90 leading-relaxed">
            Una nueva propuesta gastronómica en el corazón de Villarrica.
          </p>
        </div>
      </div>

      <section className="py-20 bg-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="prose prose-lg mx-auto text-primary/80">
            <p className="mb-8">
              Tregua nació en diciembre de 2024 en Villarrica, Chile, con una visión clara: 
              crear un espacio donde la gastronomía contemporánea se encuentra con los sabores tradicionales 
              de la región. Ubicados en un entorno privilegiado, con vistas al lago y al volcán, 
              nos propusimos desarrollar una cocina que rinde homenaje a los productos locales mientras 
              incorpora técnicas modernas y creativas.
            </p>
            <p className="mb-8">
              Nuestro chef ejecutivo ha desarrollado un menú que celebra la riqueza de la zona,
              trabajando estrechamente con productores locales para obtener los mejores ingredientes
              de cada temporada. Cada plato cuenta una historia, cada sabor evoca una memoria,
              y cada experiencia está diseñada para crear momentos memorables.
            </p>
            <p>
              En Tregua, creemos que la gastronomía va más allá de la comida; es un momento de
              pausa, de conexión y de disfrute. Un espacio donde el tiempo se detiene y los
              sentidos se despiertan. Te invitamos a ser parte de esta nueva historia.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <PhotoGrid />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-2xl font-serif text-primary mb-4">Misión</h3>
              <p className="text-primary/80">
                Crear experiencias gastronómicas excepcionales que celebren los sabores locales y la innovación culinaria.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-serif text-primary mb-4">Visión</h3>
              <p className="text-primary/80">
                Ser reconocidos como un referente en la alta cocina del sur de Chile, manteniendo nuestro compromiso con la excelencia y la sostenibilidad.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-serif text-primary mb-4">Valores</h3>
              <p className="text-primary/80">
                Excelencia, creatividad, respeto por los ingredientes locales y compromiso con nuestra comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}