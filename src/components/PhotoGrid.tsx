import { useState } from 'react';

interface Photo {
  url: string;
  alt: string;
}

const photos: Photo[] = [
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
    alt: "Interior del restaurante"
  },
  {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
    alt: "Plato gourmet"
  },
  {
    url: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&q=80",
    alt: "Chef preparando un plato"
  },
  {
    url: "https://images.unsplash.com/photo-1560717845-968823efbee1?auto=format&fit=crop&q=80",
    alt: "Detalle de plato"
  },
  {
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
    alt: "Vista de la cocina"
  },
  {
    url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
    alt: "Ambiente nocturno"
  }
];

export function PhotoGrid() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.url}
            className="relative cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedPhoto(photo.url)}
          >
            <div className="aspect-square">
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center">
                <p className="text-light text-lg font-serif opacity-0 hover:opacity-100 transition-opacity duration-300 text-center px-4">
                  {photo.alt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-primary/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Vista ampliada"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  );
}