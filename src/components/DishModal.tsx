import { X } from 'lucide-react';
import { Dish } from '../types/dish';

interface DishModalProps {
  dish: Dish;
  onClose: () => void;
}

export function DishModal({ dish, onClose }: DishModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/30 backdrop-blur-[2px]" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-light mb-4 tracking-wide">
            {dish.name}
          </h2>
          
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-light rounded-full text-sm mb-6">
            {dish.category}
          </span>
          
          <div className="max-w-2xl">
            <p className="text-lg md:text-xl text-light/90 leading-relaxed">
              {dish.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}