import { useState, useEffect } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { heroImages } from '../config/images';

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(heroImages.length).fill(false));
  const { smoothNavigate } = useSmoothScroll();

  // Precargar las imágenes
  useEffect(() => {
    heroImages.forEach((image, index) => {
      const img = new Image();
      img.src = image.webp;
      img.onload = () => {
        setImagesLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
    });
  }, []);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Precargar la siguiente imagen
  useEffect(() => {
    const nextIndex = (currentImage + 1) % heroImages.length;
    const nextImage = new Image();
    nextImage.src = heroImages[nextIndex].webp;
  }, [currentImage]);

  return (
    <div id="hero" className="relative h-screen">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image.original}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <picture>
              <source
                srcSet={image.webp}
                type="image/webp"
                media="(min-width: 640px)"
              />
              <source
                srcSet={image.original}
                type="image/jpeg"
                media="(min-width: 640px)"
              />
              <img
                src={image.thumbnail}
                alt={image.alt}
                className={`w-full h-full object-cover ${
                  imagesLoaded[index] ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-500`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </picture>
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