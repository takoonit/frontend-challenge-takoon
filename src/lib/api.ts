import { GeocodingApiResponse, GeocodingResponse } from '@/types/geocoding';

const GEOCODING_API_KEY = process.env.NEXT_PUBLIC_GEOCODING_API_KEY;
const GEOCODING_API_URL = 'https://api.geoapify.com/v1/geocode/search';

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
