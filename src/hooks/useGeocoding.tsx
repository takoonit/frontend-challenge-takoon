"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { fetchGeocoding } from '@/lib/api';
import { GeocodingState, GeocodingResponse } from '@/types/geocoding';

//Create the context
const GeocodingContext = createContext<GeocodingState | undefined>(undefined);

//Provider component
type GeocodingProviderProps = { children: ReactNode };
export const GeocodingProvider = ({ children }: GeocodingProviderProps) => {
  const [suggestions, setSuggestions] = useState<GeocodingResponse[]>([]);
  const [selectedCity, setSelectedCity] = useState<GeocodingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function searchCity(query: string): Promise<void> {
    if (!query.trim()) {
      setError('Please enter a valid city name or ZIP code.');
      setSuggestions([]);
      return;
    }
    setError(null);
    const { results, error: apiError } = await fetchGeocoding(query);
    if (apiError) {
      setError(apiError);
      setSuggestions([]);
    } else if (results.length > 0) {
      setSuggestions(results);
      setError(null);
    } else {
      setError('No matching city found.');
      setSuggestions([]);
    }
  }

  function selectCity(city: GeocodingResponse) {
    setSelectedCity(city);
    setSuggestions([]);
  }

  // Provide the state and actions
  const value: GeocodingState = {
    suggestions,
    selectedCity,
    error,
    searchCity,
    selectCity,
  };

  return (
    <GeocodingContext.Provider value={value}>
      {children}
    </GeocodingContext.Provider>
  );
};

//useGeocoding hook
export function useGeocoding() {
  const context = useContext(GeocodingContext);
  if (!context) {
    throw new Error("useGeocoding must be used within a GeocodingProvider");
  }
  return context;
}