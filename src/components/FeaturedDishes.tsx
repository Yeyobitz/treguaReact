import { useState } from 'react';
import { useDishStore } from '../stores/useDishStore';
import { useEffect } from 'react';
import { DishModal } from './DishModal';
import { Dish } from '../types/dish';

export function FeaturedDishes() {
  const { dishes, fetchDishes, loading } = useDishStore();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  
  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const featuredDishes = dishes.filter(dish => dish.featured);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 relative bg-gradient-to-b from-primary via-secondary to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-serif text-light mb-12 text-center">Platos Destacados</h3>
          <div className="text-center text-light">Cargando...</div>
        </div>
      </section>
    );
  }

  if (featuredDishes.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary to-primary opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(130,13,14,0.1)_0%,transparent_65%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-serif text-light mb-8 sm:mb-12 text-center">Platos Destacados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {featuredDishes.map((dish) => (
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

        {selectedDish && (
          <DishModal 
            dish={selectedDish} 
            onClose={() => setSelectedDish(null)} 
          />
        )}
      </div>
    </section>
  );
}