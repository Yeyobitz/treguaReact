import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Dish } from '../../types/dish';

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
    padding: 30,
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  restaurantName: {
    fontFamily: 'Playfair Display',
    fontSize: 40,
    color: '#1A1A1A',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#820D0E',
    marginBottom: 30,
  },
  categoryTitle: {
    fontFamily: 'Playfair Display',
    fontSize: 24,
    color: '#820D0E',
    marginBottom: 20,
    marginTop: 20,
  },
  dishContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottom: '1px solid #EEEEEE',
    paddingBottom: 20,
  },
  dishImage: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: 10,
    marginRight: 20,
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    fontFamily: 'Playfair Display',
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 5,
  },
  dishDescription: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
    lineHeight: 1.4,
  },
  dishPrice: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#820D0E',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
    fontFamily: 'Inter',
  },
});

interface MenuPDFProps {
  dishes: Dish[];
}

export function MenuPDF({ dishes }: MenuPDFProps) {
  // Agrupar platos por categoría
  const dishesByCategory = dishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<string, Dish[]>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.restaurantName}>Tregua</Text>
          <Text style={styles.subtitle}>Cocina de Autor</Text>
          <View style={styles.divider} />
        </View>

        {/* Contenido del menú por categorías */}
        {Object.entries(dishesByCategory).map(([category, categoryDishes]) => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {categoryDishes.map((dish) => (
              <View key={dish.id} style={styles.dishContainer}>
                <Image
                  src={dish.image}
                  style={styles.dishImage}
                />
                <View style={styles.dishInfo}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <Text style={styles.dishDescription}>{dish.description}</Text>
                  <Text style={styles.dishPrice}>${dish.price.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Pie de página */}
        <Text style={styles.footer}>
          Tregua Restaurant • Camino Villarrica-Pucón Km 2, Villarrica, Chile • +56 45 241 9200
        </Text>
      </Page>
    </Document>
  );
} 