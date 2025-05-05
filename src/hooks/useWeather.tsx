'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchHourlyForecast, fetchWeatherByCoordinates } from '@/lib/api';
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

type WeatherProviderProps = { children: ReactNode };


export const WeatherProvider = ({ children }: WeatherProviderProps) => {
  const { selectedCity } = useGeocoding();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<HourlyForecast[]>([]);
  const {unit} = useTemperatureUnit();


  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      setIsLoading(true);
      const [{ result: weatherResult, error: weatherErr }, { result: forecastResult }] = await Promise.all([
        fetchWeatherByCoordinates({ latitude: lat, longitude: lon },unit),
        fetchHourlyForecast({ latitude: lat, longitude: lon }, unit),
      ]);

      setWeather(weatherResult);
      setForecast(forecastResult);
      setError(weatherErr);
      setIsLoading(false);
    };

    if (selectedCity) {
      fetchWeather(selectedCity.coordinates.latitude, selectedCity.coordinates.longitude);
    } else {
      // Use browser geolocation
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable', err);
          setError('Please search for a city to see weather details.');
        },
        { timeout: 10000 }
      );
    }
  }, [selectedCity, unit]);

  return (
    <WeatherContext.Provider value={{ weather, forecast, error, isLoading }}>
      {children}
    </WeatherContext.Provider>
  );
};

export function useWeather(): WeatherState {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
}
