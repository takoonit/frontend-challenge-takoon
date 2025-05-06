export type TemperatureUnit = 'metric' | 'imperial' | 'standard';

export const TemperatureUnitSymbol: Record<TemperatureUnit, string> = {
	metric: '°C',
	imperial: '°F',
	standard: 'K',
};

export type WeatherData = {
	temperature: number;
	feelsLike: number;
	minTemp?: number | null;
	maxTemp?: number | null;
	weatherMain: string;
	description: string;
	icon: string;
	windSpeed: number;
	humidity: number;
	pressure: number;
	rainVolume?: number;
	timezone?: number;
};

export type WeatherApiResponse = {
	message: string;
	coord: {
		lon: number;
		lat: number;
	};
	weather: {
		main: string;
		description: string;
		icon: string;
	}[];
	main: {
		temp: number;
		feels_like: number;
		temp_min?: number;
		temp_max?: number;
		pressure: number;
		humidity: number;
	};
	wind: {
		speed: number;
	};
	rain?: {
		'1h'?: number;
		'3h'?: number;
	};
	timezone?: number; // offset in seconds
	name?: string;
	dt: number;
};

export type HourlyForecast = {
	time: number; // UNIX timestamp (ms)
	temperature: number;
	icon: string;
	description: string;
};
