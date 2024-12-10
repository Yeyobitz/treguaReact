import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDishStore } from '../stores/useDishStore';
import { useEffect } from 'react';

export function DishDetail() {
  const { id } = useParams();
  const { dishes, fetchDishes, loading } = useDishStore();
  
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

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
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