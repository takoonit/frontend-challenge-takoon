'use client';
import { useEffect, useState } from 'react';
import { GeocodingResponse } from '@/types/geocoding';

const STORAGE_KEY = 'favoriteCities';

export function useFavorites() {
  const [favorites, setFavorites] = useState<GeocodingResponse[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.warn('Invalid favoriteCities in localStorage');
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(city: GeocodingResponse) {
    if (!isFavorite(city)) {
      setFavorites((prev) => [...prev, city]);
    }
  }

  function removeFavorite(city: GeocodingResponse) {
    setFavorites((prev) =>
      prev.filter(
        (fav) =>
          fav.city !== city.city || fav.coordinates.latitude !== city.coordinates.latitude
      )
    );
  }

  function isFavorite(city: GeocodingResponse): boolean {
    return favorites.some(
      (fav) =>
        fav.city === city.city &&
        fav.coordinates.latitude === city.coordinates.latitude &&
        fav.coordinates.longitude === city.coordinates.longitude
    );
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
