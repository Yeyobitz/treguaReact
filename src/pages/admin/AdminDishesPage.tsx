import { useState, useEffect } from 'react';
import { useDishStore } from '../../stores/useDishStore';
import { DishForm } from '../../components/admin/dishes/DishForm';
import { DishList } from '../../components/admin/dishes/DishList';
import { Plus } from 'lucide-react';

export function AdminDishesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { dishes, loading, error, fetchDishes } = useDishStore();

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-primary dark:text-light">Gestión de Platos</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Plato
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent" />
        </div>
      ) : (
        <DishList dishes={dishes} />
      )}

      {isFormOpen && (
        <DishForm onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}