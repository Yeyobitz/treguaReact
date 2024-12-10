import { useState } from 'react';
import { useDishStore } from '../stores/useDishStore';
import { useEffect } from 'react';
import { DishModal } from '../components/DishModal';
import { Dish } from '../types/dish';

export function PlatosPage() {
  const { dishes, fetchDishes, loading } = useDishStore();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  
  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&q=80"
            alt="Nuestros Platos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-light mb-8">
            Nuestros Platos
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-light/90 leading-relaxed">
            Descubra nuestra selección de platos, donde la tradición se encuentra con la innovación.
          </p>
        </div>
      </div>

      <section className="py-12 sm:py-16 lg:py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {dishes.map((dish) => (
                <button 
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <h4 className="text-xl sm:text-2xl font-serif text-light text-center px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {dish.name}
                    </h4>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedDish && (
            <DishModal 
              dish={selectedDish} 
              onClose={() => setSelectedDish(null)} 
            />
          )}
        </div>
      </section>
    </div>
  );
}