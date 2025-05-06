'use client';
import { useEffect, useState } from 'react';
import { GeocodingResponse } from '@/types/geocoding';
import { getCityId } from '@/lib/cityUtils';

const STORAGE_KEY = 'favoriteCities';

export function useFavorites() {
	// Initialize with empty array to prevent null issues
	const [favorites, setFavorites] = useState<GeocodingResponse[]>([]);
	const [initialized, setInitialized] = useState(false);

	// Load favorites from localStorage only once on mount
	useEffect(() => {
		try {
			const saved =
				typeof window !== 'undefined'
					? localStorage.getItem(STORAGE_KEY)
					: null;
			if (saved) {
				const parsedFavorites = JSON.parse(saved);
				console.log('Loaded favorites from storage:', parsedFavorites);
				setFavorites(parsedFavorites);
			}
			setInitialized(true);
		} catch (e) {
			console.error('Error loading favorites:', e);
			setInitialized(true);
		}
	}, []);

	// Save to localStorage whenever favorites change
	useEffect(() => {
		// Only save after initial load to prevent overwriting
		if (initialized && typeof window !== 'undefined') {
			try {
				console.log('Saving favorites to storage:', favorites);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
			} catch (e) {
				console.error('Error saving favorites:', e);
			}
		}
	}, [favorites, initialized]);

	function addFavorite(city: GeocodingResponse) {
		console.log('Adding favorite:', city);
		if (!isFavorite(city)) {
			// Create a new city object with ID
			const cityWithId = {
				...city,
				id: city.id || getCityId(city) // Ensure ID is assigned
			};
			setFavorites(prev => [...prev, cityWithId]);
		}
	}

	function removeFavorite(city: GeocodingResponse) {
		console.log('Removing favorite:', city);
		const cityId = city.id || getCityId(city);
		setFavorites((prevFavorites) =>
			prevFavorites.filter((fav) => {
				const favId = fav.id || getCityId(fav);
				return favId !== cityId;
			})
		);
	}

	function isFavorite(geocodingResponse: GeocodingResponse): boolean {
		if (!geocodingResponse) return false;

		const cityId = geocodingResponse.id || getCityId(geocodingResponse);
		return favorites.some((fav) => {
			const favId = fav.id || getCityId(fav);
			return favId === cityId;
		});
	}

	return {
		favorites,
		addFavorite,
		removeFavorite,
		isFavorite,
	};
}