export type Coordinates = {
    longitude: number;
    latitude: number;
};

export type GeocodingResponse = {
    city: string;
    country: string;
    postcode: string;
    coordinates: Coordinates;
};

export type GeocodingApiResponse = {
    features: {
        properties: { city: string; country: string, postcode: string };
        geometry: { coordinates: [number, number] };
    }[];
};

export type GeocodingState = {
    suggestions: GeocodingResponse[];
    selectedCity: GeocodingResponse | null;
    error: string | null;
    searchCity: (query: string) => Promise<void>;
    selectCity: (city: GeocodingResponse) => void;
};

export type CitySearchProps = {
    query: string;
    suggestions: GeocodingResponse[];
    selectedCity: GeocodingResponse | null;
    searchCity: (query: string) => Promise<void>;
    selectCity: (city: GeocodingResponse) => void;
    setQuery: (value: string) => void;
    error: string | null;
};