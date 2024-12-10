import { useState, useEffect } from 'react';

const images = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&q=80"
];

export function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Tregua ambiente ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}