'use client';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { fetchHourlyForecast, fetchWeatherByCoordinates } from '@/lib/api';
import { Coordinates } from '@/types/geocoding';
import { HourlyForecast, WeatherData } from '@/types/weather';
import { useGeocoding } from './useGeocoding';
import { useTemperatureUnit } from './useTemperatureUnit';

export type WeatherState = {
	weather: WeatherData | null;
	forecast: HourlyForecast[];
	error: string | null;
	isLoading: boolean;
};

const WeatherContext = createContext<WeatherState | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
	const state = useWeather();
	return (
		<WeatherContext.Provider value={state}>{children}</WeatherContext.Provider>
	);
}

// Hook can work standalone OR via context
export function useWeather(coordinates?: Coordinates): WeatherState {
	const { selectedCity } = useGeocoding();
	const { unit } = useTemperatureUnit();

	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [forecast, setForecast] = useState<HourlyForecast[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const coordsToUse: Coordinates | undefined =
		coordinates || selectedCity?.coordinates;

	useEffect(() => {
		if (!coordsToUse) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					fetchWeather(pos.coords.latitude, pos.coords.longitude);
				},
				(err) => {
					console.warn('Geolocation failed', err);
					setError('Please search for a city to see weather details.');
				},
				{ timeout: 10000 }
			);
		} else {
			fetchWeather(coordsToUse.latitude, coordsToUse.longitude);
		}
	}, [coordsToUse?.latitude, coordsToUse?.longitude, unit]);

	const fetchWeather = async (lat: number, lon: number) => {
		setIsLoading(true);
		setError(null);

		const [
			{ result: weatherResult, error: weatherErr },
			{ result: forecastResult },
		] = await Promise.all([
			fetchWeatherByCoordinates({ latitude: lat, longitude: lon }, unit),
			fetchHourlyForecast({ latitude: lat, longitude: lon }, unit),
		]);

		setWeather(weatherResult);
		setForecast(forecastResult);
		setError(weatherErr);
		setIsLoading(false);
	};

	return {
		weather,
		forecast,
		error,
		isLoading,
	};
}

// 🔹 useContext version for components inside <WeatherProvider>
export function useWeatherContext(): WeatherState {
	const ctx = useContext(WeatherContext);
	if (!ctx)
		throw new Error('useWeatherContext must be used within WeatherProvider');
	return ctx;
}
