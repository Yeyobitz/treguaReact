import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Dish } from '../../types/dish';
import { useState, useEffect } from 'react';

// Registrar fuentes personalizadas
Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtXK-F2qC0s.woff',
});

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff',
});

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  restaurantName: {
    fontFamily: 'Playfair Display',
    fontSize: 48,
    color: '#820D0E',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    color: '#666666',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#820D0E',
    opacity: 0.8,
    marginBottom: 30,
  },
  categoryTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 28,
    color: '#820D0E',
    marginBottom: 24,
    marginTop: 32,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dishContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottom: '1px solid #EEEEEE',
    alignItems: 'center',
  },
  dishImageContainer: {
    width: 120,
    height: 120,
    marginRight: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dishImage: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    fontFamily: 'Playfair Display',
    fontSize: 20,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  dishDescription: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 1.6,
  },
  dishPrice: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#820D0E',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    paddingTop: 20,
    borderTop: '1px solid #EEEEEE',
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#666666',
    marginBottom: 4,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 12,
    color: '#666666',
  },
  decorativeLine: {
    width: 60,
    height: 1,
    backgroundColor: '#820D0E',
    opacity: 0.8,
    alignSelf: 'center',
    margin: '10px 0',
  },
});

interface ProcessedImageResult {
  id: string;
  image: string;
}

interface MenuPDFProps {
  dishes: Dish[];
}

export function MenuPDF({ dishes }: MenuPDFProps) {
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Función para convertir imagen a base64
  const convertImageToBase64 = async (url: string): Promise<string> => {
    try {
      // Si ya es base64, retornarlo directamente
      if (url.startsWith('data:image')) {
        return url;
      }

      // Intentar cargar la imagen directamente
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      return '';
    }
  };

  // Función para procesar todas las imágenes
  const processImages = async () => {
    const imagePromises = dishes.map(async (dish) => {
      if (!dish.image || !dish.id) return null;

      try {
        const base64Image = await convertImageToBase64(dish.image);
        return { id: dish.id, image: base64Image } as ProcessedImageResult;
      } catch (error) {
        console.error(`Error processing image for dish ${dish.id}:`, error);
        return null;
      }
    });

    const results = await Promise.all(imagePromises);
    const processedObj: Record<string, string> = {};
    
    results.forEach((result) => {
      if (result && result.id) {
        processedObj[result.id] = result.image;
      }
    });

    setProcessedImages(processedObj);
    setIsLoading(false);
  };

  useEffect(() => {
    processImages();
  }, [dishes]);

  // Agrupar platos por categoría
  const dishesByCategory = dishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<string, Dish[]>);

  if (isLoading) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.restaurantName}>Cargando...</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image 
            src="/tregua-logo.png"
            style={styles.logo}
          />
          <Text style={styles.restaurantName}>Tregua</Text>
          <Text style={styles.subtitle}>Cocina de Autor</Text>
          <View style={styles.divider} />
        </View>

        {/* Contenido del menú por categorías */}
        {Object.entries(dishesByCategory).map(([category, categoryDishes]) => (
          <View key={category} wrap={false}>
            <View style={styles.decorativeLine} />
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.decorativeLine} />
            
            {categoryDishes.map((dish) => (
              <View key={dish.id} style={styles.dishContainer}>
                {dish.id && processedImages[dish.id] && (
                  <View style={styles.dishImageContainer}>
                    <Image
                      src={processedImages[dish.id]}
                      style={styles.dishImage}
                    />
                  </View>
                )}
                <View style={styles.dishInfo}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <Text style={styles.dishDescription}>{dish.description}</Text>
                  <Text style={styles.dishPrice}>$ {dish.price.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tregua Restaurant
          </Text>
          <Text style={styles.footerText}>
            Camino Villarrica-Pucón Km 2, Villarrica, Chile
          </Text>
          <Text style={styles.footerText}>
            +56 45 241 9200 • contacto@tregua.cl
          </Text>
        </View>

        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
        />
      </Page>
    </Document>
  );
} 