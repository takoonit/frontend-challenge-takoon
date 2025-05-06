import { render, screen } from '@testing-library/react';
import CityDetailPage from '@/app/city-details/page';
import { useFavorites } from '@/hooks/useFavorites';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useWeather } from '@/hooks/useWeather';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import { TemperatureUnit } from '@/types/weather';

// Mock the required hooks
jest.mock('@/hooks/useFavorites');
jest.mock('@/hooks/useGeocoding');
jest.mock('@/hooks/useWeather');
jest.mock('@/hooks/useTemperatureUnit');

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
	useRouter() {
		return {
			push: jest.fn(),
			back: jest.fn(),
			forward: jest.fn(),
		};
	},
	usePathname() {
		return '/city-details';
	},
	useSearchParams() {
		return new URLSearchParams('id=london-51.000000-0.000000');
	},
}));

describe('CityDetailPage', () => {
	const mockCity = {
		id: 'london-51.000000-0.000000',
		city: 'London',
		country: 'UK',
		postcode: 'SW1',
		coordinates: { latitude: 51, longitude: 0 },
	};

	const mockWeatherData = {
		temperature: 20,
		feelsLike: 19,
		minTemp: 17,
		maxTemp: 23,
		humidity: 65,
		pressure: 1012,
		windSpeed: 5.2,
		description: 'Broken clouds',
		weatherMain: 'Clouds',
		icon: '04d',
		timezone: 3600,
	};

	const mockForecast = [
		{
			time: '2023-06-01T13:00:00Z',
			temperature: 21,
			icon: '04d',
			description: 'Broken clouds',
		},
		{
			time: '2023-06-01T14:00:00Z',
			temperature: 22,
			icon: '04d',
			description: 'Broken clouds',
		},
	];

	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks();

		// Setup default mock implementations
		(useFavorites as jest.Mock).mockReturnValue({
			favorites: [mockCity],
			addFavorite: jest.fn(),
			removeFavorite: jest.fn(),
			isFavorite: jest.fn().mockReturnValue(true),
			findCityById: jest.fn().mockReturnValue(mockCity),
		});

		(useGeocoding as jest.Mock).mockReturnValue({
			selectedCity: null,
			selectCity: jest.fn(),
			searchCity: jest.fn(),
			suggestions: [],
			error: null,
		});

		(useWeather as jest.Mock).mockReturnValue({
			weather: mockWeatherData,
			forecast: mockForecast,
			error: null,
			isLoading: false,
		});

		// Mock temperature unit hook
		(useTemperatureUnit as jest.Mock).mockReturnValue({
			unit: 'metric',
			setUnit: jest.fn(),
		});
	});

	it('renders the city detail page correctly', () => {
		render(<CityDetailPage />);

		// Check that city name is displayed
		expect(screen.getByText('London, UK')).toBeInTheDocument();

		// Check that weather data is displayed
		expect(screen.getByText('Clouds – Broken clouds')).toBeInTheDocument();
		expect(screen.getByText('20.0 °C')).toBeInTheDocument();

		// Check for weather details (test key elements only)
		expect(screen.getByText('Feels Like: 19.0 °C')).toBeInTheDocument();
		expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();
		expect(screen.getByText('Wind: 5.2 m/s')).toBeInTheDocument();

		// Check for forecast section
		expect(screen.getByText('Next 24 Hours')).toBeInTheDocument();
	});

	it('displays loading state', () => {
		(useWeather as jest.Mock).mockReturnValue({
			weather: null,
			forecast: [],
			error: null,
			isLoading: true,
		});

		render(<CityDetailPage />);

		expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
	});

	it('displays temperatures with correct unit symbol when unit changes', () => {
		// Test for each temperature unit
		const testUnits: { unit: TemperatureUnit; symbol: string }[] = [
			{ unit: 'metric', symbol: '°C' },
			{ unit: 'imperial', symbol: '°F' },
			{ unit: 'standard', symbol: 'K' },
		];

		testUnits.forEach(({ unit, symbol }) => {
			// Update the mock to use the current unit
			(useTemperatureUnit as jest.Mock).mockReturnValue({
				unit,
				setUnit: jest.fn(),
			});

			const { unmount } = render(<CityDetailPage />);

			// Verify main temperature display shows correct unit
			expect(screen.getByText(`20.0 ${symbol}`)).toBeInTheDocument();

			// Verify other temperature values show correct unit
			expect(
				screen.getByText(`Feels Like: 19.0 ${symbol}`)
			).toBeInTheDocument();
			expect(screen.getByText(`Min: 17.0 ${symbol}`)).toBeInTheDocument();
			expect(screen.getByText(`Max: 23.0 ${symbol}`)).toBeInTheDocument();

			// Clean up before next render
			unmount();
		});
	});
});
