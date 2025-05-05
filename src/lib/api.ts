import { GeocodingApiResponse, GeocodingResponse } from '@/types/geocoding';

import { Coordinates } from '@/types/geocoding';
import { HourlyForecast, TemperatureUnit, WeatherApiResponse, WeatherData } from '@/types/weather';

const GEOCODING_API_KEY = process.env.NEXT_PUBLIC_GEOCODING_API_KEY;
const GEOCODING_API_URL = 'https://api.geoapify.com/v1/geocode/search';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY!;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';


export async function fetchGeocoding(query: string): Promise<{ results: GeocodingResponse[]; error: string | null }> {
  try {
    const response = await fetch(`${GEOCODING_API_URL}?text=${encodeURIComponent(query)}&apiKey=${GEOCODING_API_KEY}`);
    if (!response.ok) {
      return { results: [], error: `API error: ${response.statusText}` };
    }
    const data: GeocodingApiResponse = await response.json();
    const results = data.features
      .filter(feature => feature.properties.city)
      .map(feature => ({
        city: feature.properties.city,
        country: feature.properties.country,
        postcode: feature.properties.postcode,
        coordinates: {
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
        }
      } satisfies GeocodingResponse)); //Validation
    return { results, error: null };
  } catch (error: any) {
    console.error('Geocoding API Error:', error);
    return { results: [], error: error?.message || 'Unknown error occurred' };
  }
}

export async function fetchWeatherByCoordinates(
  { latitude, longitude }: Coordinates, unit: TemperatureUnit
): Promise<{ result: WeatherData | null; error: string | null }> {
  const url = `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${WEATHER_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(data?.message || 'API error');

    const result: WeatherData = {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      weatherMain: data.weather?.[0]?.main || 'N/A',
      description: data.weather?.[0]?.description || '',
      icon: data.weather?.[0]?.icon || '',
      windSpeed: data.wind.speed,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      rainVolume: data.rain?.['1h'] ?? data.rain?.['3h'] ?? 0,
      minTemp: data.main.temp_min,
      maxTemp: data.main.temp_max,
    };

    return { result, error: null };
  } catch (err: any) {
    return { result: null, error: err.message || 'Unknown error' };
  }
}

export async function fetchHourlyForecast(
  { latitude, longitude }: Coordinates, unit: TemperatureUnit
): Promise<{ result: HourlyForecast[]; error: string | null }> {
  const url = `${FORECAST_API_URL}?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${WEATHER_API_KEY}`;
  console.log(url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'API error');

    const result: HourlyForecast[] = data.list.slice(0, 8).map((entry: any) => ({
      time: entry.dt * 1000,
      temperature: entry.main.temp,
      icon: entry.weather?.[0]?.icon || '',
      description: entry.weather?.[0]?.description || '',
    }));
    console.log(result);

    return { result, error: null };
  } catch (err: any) {
    return { result: [], error: err.message || 'Unknown error' };
  }
}