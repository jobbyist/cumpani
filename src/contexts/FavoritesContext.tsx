import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (companionId: string) => void;
  isFavorite: (companionId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage on mount
    const storedFavorites = localStorage.getItem('cumpani_favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse stored favorites:', error);
        localStorage.removeItem('cumpani_favorites');
      }
    }
  }, []);

  const toggleFavorite = (companionId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(companionId)
        ? prev.filter((id) => id !== companionId)
        : [...prev, companionId];
      
      localStorage.setItem('cumpani_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (companionId: string) => {
    return favorites.includes(companionId);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
