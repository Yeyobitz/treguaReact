import { useState, useRef } from 'react';
import { useDishStore } from '../../stores/useDishStore';
import { CreateDishDTO, dishSchema } from '../../types/dish';
import { X, Upload, Link as LinkIcon } from 'lucide-react';

interface DishFormProps {
  dish?: CreateDishDTO;
  onClose: () => void;
}

const initialData: CreateDishDTO = {
  name: '',
  description: '',
  image: '',
  price: 0,
  featured: false,
  category: ''
};

export function DishForm({ dish = initialData, onClose }: DishFormProps) {
  const [formData, setFormData] = useState(dish);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUrlInput, setIsUrlInput] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(dish.image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDish, updateDish } = useDishStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      dishSchema.parse(formData);
      if ('id' in dish) {
        await updateDish(dish.id!, formData);
      } else {
        await addDish(formData);
      }
      onClose();
    } catch (error) {
      if (error.errors) {
        const formErrors = {};
        error.errors.forEach(err => {
          formErrors[err.path[0]] = err.message;
        });
        setErrors(formErrors);
      }
    }
  };

  const handleChange = (field: keyof CreateDishDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewUrl(imageUrl);
        handleChange('image', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInputType = () => {
    setIsUrlInput(!isUrlInput);
    setPreviewUrl('');
    handleChange('image', '');
  };

  return (
    <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-light dark:bg-primary w-full max-w-xl rounded-xl shadow-lg my-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-primary dark:text-light">
              {dish.id ? 'Editar Plato' : 'Nuevo Plato'}
            </h2>
            <button
              onClick={onClose}
              className="text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6 md:col-span-1">
                <div>
                  <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange('price', Number(e.target.value))}
                    className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6 md:col-span-1">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-primary/80 dark:text-light/80">
                      Imagen
                    </label>
                    <button
                      type="button"
                      onClick={toggleInputType}
                      className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center"
                    >
                      {isUrlInput ? (
                        <>
                          <Upload className="w-4 h-4 mr-1" />
                          Subir archivo
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4 mr-1" />
                          Usar URL
                        </>
                      )}
                    </button>
                  </div>

                  {isUrlInput ? (
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        handleChange('image', e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                      className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                      placeholder="https://"
                    />
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-neutral rounded-lg flex items-center justify-center cursor-pointer hover:border-accent transition-colors"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="text-center text-primary/60 dark:text-light/60">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm">Click para subir imagen</span>
                      </div>
                    </div>
                  )}

                  {previewUrl && (
                    <div className="mt-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {errors.image && (
                    <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="rounded border-neutral text-accent focus:ring-accent"
                  />
                  <label
                    htmlFor="featured"
                    className="ml-2 text-sm text-primary/80 dark:text-light/80"
                  >
                    Destacado
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-neutral/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors"
              >
                {dish.id ? 'Guardar cambios' : 'Crear plato'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}