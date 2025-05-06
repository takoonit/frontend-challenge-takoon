import { GeocodingResponse } from '@/types/geocoding';

export function getCityId(city: GeocodingResponse) {
	// If it already has an ID, use that
	if (city.id) return city.id;

	// Otherwise generate a stable ID
	const lat = city.coordinates.latitude.toFixed(6);
	const lon = city.coordinates.longitude.toFixed(6);
	return `${city.city.replace(/\s+/g, '-').toLowerCase()}-${lat}-${lon}`;
}

export function findCityById(
	id: string,
	favorites: GeocodingResponse[]
): GeocodingResponse | null {
	return (
		favorites.find((city) => {
			// If the city has an ID property, check that first
			if (city.id) return city.id === id;

			// Fall back to generated ID
			return getCityId(city) === id;
		}) || null
	);
}
