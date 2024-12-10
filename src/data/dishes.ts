export interface Dish {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const dishes: Dish[] = [
  {
    id: "curanto",
    name: "Curanto en Olla",
    description: "Entre vapores ancestrales y aromas marinos, el Curanto emerge como un testimonio vivo de la tradición chilota. Cada capa revela un secreto culinario, donde mariscos y carnes danzan al compás de los milcaos, creando una sinfonía de sabores que honra a nuestros antepasados.",
    image: "https://images.unsplash.com/photo-1560717845-968823efbee1?auto=format&fit=crop&q=80"
  },
  {
    id: "locro",
    name: "Locro de Quinoa",
    description: "Desde las alturas del altiplano, donde el viento susurra antiguas recetas, nace nuestro Locro de Quinoa. Un abrazo cálido de granos dorados y verduras del valle, coronado con queso de cabra que se deshace como nubes sobre las montañas andinas.",
    image: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&q=80"
  },
  {
    id: "asado",
    name: "Asado al Trapo",
    description: "Un ritual de fuego y tiempo, donde la carne argentina se envuelve en lienzos de algodón como un tesoro preciado. Las hierbas nativas impregnan cada fibra, creando una corteza de sabores que guarda en su interior la jugosidad de las pampas.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80"
  }
];