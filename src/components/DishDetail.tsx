import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDishStore } from '../stores/useDishStore';
import { useEffect, useState } from 'react';

export function DishDetail() {
  const { id } = useParams();
  const { dishes, fetchDishes, loading } = useDishStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  const dish = dishes.find(d => d.id === id);

  if (!dish) {
    return <Navigate to="/" />;
  }

  // Función para obtener URLs optimizadas
  const getOptimizedImageUrls = (originalUrl: string) => {
    const baseUrl = originalUrl.split('?')[0];
    return {
      webp: `${baseUrl}?auto=format&fit=crop&w=1920&fm=webp&q=80`,
      thumbnail: `${baseUrl}?auto=format&fit=crop&w=400&q=60`,
      original: `${baseUrl}?auto=format&fit=crop&w=1920&q=80`
    };
  };

  const imageUrls = getOptimizedImageUrls(dish.image);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <picture>
          <source
            srcSet={imageUrls.webp}
            type="image/webp"
            media="(min-width: 640px)"
          />
          <source
            srcSet={imageUrls.original}
            type="image/jpeg"
            media="(min-width: 640px)"
          />
          <img
            src={imageUrls.thumbnail}
            alt={dish.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-white text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-8">
          {dish.name}
        </h1>
        <p className="max-w-2xl text-lg md:text-xl leading-relaxed">
          {dish.description}
        </p>
        <Link
          to="/"
          className="mt-12 inline-flex items-center text-sm border border-white/20 rounded-full px-6 py-3 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default DishDetail;