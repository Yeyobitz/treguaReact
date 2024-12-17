interface ImageConfig {
  original: string;
  webp: string;
  thumbnail: string;
  alt: string;
}

export const heroImages: ImageConfig[] = [
  {
    original: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80",
    webp: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&fm=webp&q=80",
    thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=60",
    alt: "Restaurante Tregua - Ambiente elegante"
  },
  {
    original: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80",
    webp: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&fm=webp&q=80",
    thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=60",
    alt: "Restaurante Tregua - Platos exclusivos"
  },
  {
    original: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&w=1920&q=80",
    webp: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&w=1920&fm=webp&q=80",
    thumbnail: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&w=400&q=60",
    alt: "Restaurante Tregua - Experiencia culinaria"
  }
]; 