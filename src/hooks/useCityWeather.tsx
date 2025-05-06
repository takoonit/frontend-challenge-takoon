'use client';
import { useEffect, useState } from 'react';
import { WeatherData } from '@/types/weather';
import { GeocodingResponse } from '@/types/geocoding';
import { fetchWeatherByCoordinates } from '@/lib/api';
import { useTemperatureUnit } from './useTemperatureUnit';

export function useCityWeather(city: GeocodingResponse) {
	const { unit } = useTemperatureUnit();
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			const { result, error } = await fetchWeatherByCoordinates(
				city.coordinates,
				unit
			);
			if (result) setWeather(result);
			else setError(error);
			setLoading(false);
		};
		load();
	}, [city, unit]);

	return { weather, loading, error };
}
