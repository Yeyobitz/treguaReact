import { useState } from 'react';
import { Dish } from '../../types/dish';
import { useDishStore } from '../../stores/useDishStore';
import { DishForm } from './DishForm';
import { Edit, Trash2, Star } from 'lucide-react';

interface DishListProps {
  dishes: Dish[];
}

export function DishList({ dishes }: DishListProps) {
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const { deleteDish } = useDishStore();

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este plato?')) {
      await deleteDish(id);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish) => (
        <div
          key={dish.id}
          className="bg-white dark:bg-primary/50 rounded-xl shadow-sm overflow-hidden transition-colors"
        >
          <div className="aspect-video relative">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            {dish.featured && (
              <div className="absolute top-2 right-2">
                <Star className="w-5 h-5 text-accent fill-current" />
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-medium text-primary dark:text-light mb-2">
              {dish.name}
            </h3>
            <p className="text-sm text-primary/60 dark:text-light/60 mb-4">
              {dish.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-accent font-medium">
                ${dish.price.toLocaleString()}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingDish(dish)}
                  className="p-2 text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(dish.id!)}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {editingDish && (
        <DishForm
          dish={editingDish}
          onClose={() => setEditingDish(null)}
        />
      )}
    </div>
  );
}