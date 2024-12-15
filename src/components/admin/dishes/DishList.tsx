import { useState } from 'react';
import { Dish } from '../../../types/dish';
import { DishForm } from './DishForm';
import { Edit, Trash2, Star } from 'lucide-react';
import { useDishStore } from '../../../stores/useDishStore';
import { useAuth } from '../../../hooks/useAuth';

interface DishListProps {
  dishes: Dish[];
}

export function DishList({ dishes }: DishListProps) {
  const { role } = useAuth();
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const { deleteDish } = useDishStore();

  const canDelete = role === 'admin';
  const canEdit = role === 'admin' || role === 'manager';

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
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-primary dark:text-light">
                {dish.name}
              </h3>
              <span className="text-accent font-medium">
                ${dish.price.toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-primary/60 dark:text-light/60 mb-4 line-clamp-2">
              {dish.description}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-sm text-primary/60 dark:text-light/60">
                {dish.category}
              </span>
              <div className="flex space-x-2">
                {canEdit && (
                  <button
                    onClick={() => setEditingDish(dish)}
                    className="p-2 text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light transition-colors"
                    title="Editar plato"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(dish.id!)}
                    className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    title="Eliminar plato"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
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