import { useState, useEffect } from 'react';
import { useDishStore } from '../../stores/useDishStore';
import { DishForm } from '../../components/admin/dishes/DishForm';
import { DishList } from '../../components/admin/dishes/DishList';
import { Plus, FileDown } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MenuPDF } from '../../components/admin/MenuPDF';

export function AdminDishesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { dishes, loading, error, fetchDishes } = useDishStore();
  const [showExportButton, setShowExportButton] = useState(false);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  useEffect(() => {
    if (dishes.length > 0) {
      setShowExportButton(true);
    }
  }, [dishes]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-primary dark:text-light">
          Gestión de Platos
        </h1>

        <div className="flex items-center space-x-4">
          {showExportButton && (
            <PDFDownloadLink
              document={<MenuPDF dishes={dishes} />}
              fileName="menu-tregua.pdf"
              className="inline-flex items-center px-4 py-2 bg-primary/10 dark:bg-light/10 text-primary dark:text-light rounded-lg hover:bg-primary/20 dark:hover:bg-light/20 transition-colors text-sm"
            >
              {({ loading: pdfLoading }) => (
                <>
                  <FileDown className="w-4 h-4 mr-2" />
                  {pdfLoading ? 'Generando PDF...' : 'Exportar Menú'}
                </>
              )}
            </PDFDownloadLink>
          )}

          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Plato
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary dark:border-light border-r-transparent" />
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