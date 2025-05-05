"use client"
import CitySearchBar from "@/components/search/CitySearchBar";
import { useGeocoding } from '@/hooks/useGeocoding';

export default function Home() {
  const { selectedCity } = useGeocoding();
  return (
    <>
      {/* Show selected city and coordinates if available */}
      {selectedCity && (
        <div style={{ marginTop: 24, fontSize: '1.1rem' }}>
          <strong>Selected City:</strong> {selectedCity.city}<br />
          <strong>Longitude:</strong> {selectedCity.coordinates.longitude}<br />
          <strong>Latitude:</strong> {selectedCity.coordinates.latitude}
        </div>
      )}
      <p>Hi</p>
    </>
  );
}
