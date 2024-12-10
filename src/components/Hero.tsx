import { useState, useEffect } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

const images = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&q=80"
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const { smoothNavigate } = useSmoothScroll();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="hero" className="relative h-screen">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Tregua ambiente ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Gradient overlay for better text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        {/* Logo and Text Container */}
        <div className="w-full max-w-xl mx-auto mb-12 text-center">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif text-light mb-6 tracking-wider drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
            Tregua
          </h1>
          <div className="h-px w-32 mx-auto bg-light/80 mb-6" />
          <p className="text-2xl md:text-3xl italic font-serif text-light/90 tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
            Cocina de autor
          </p>
        </div>

        {/* CTA Button */}
        <button 
          onClick={() => smoothNavigate('/reservas')}
          className="bg-accent/90 backdrop-blur-sm text-light px-8 py-3 rounded-full hover:bg-accent transition-colors text-sm tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Reservar Mesa
        </button>
      </div>
    </div>
  );
}