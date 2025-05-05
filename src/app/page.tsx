"use client"
import CitySearchBar from "@/components/search/CitySearchBar";
import WeatherDetail from "@/components/weather/WeatherDetail";
import { useGeocoding } from '@/hooks/useGeocoding';

export default function Home() {
  const { selectedCity } = useGeocoding();
  return (
    <>
      {selectedCity && (
        <WeatherDetail />
      )}
    </>
  );
}
