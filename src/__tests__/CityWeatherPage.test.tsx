import { fireEvent, render, screen } from '@testing-library/react';
import CityWeatherPage from '@/app/detail/page';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useWeather } from '@/hooks/useWeather';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import { useFavorites } from '@/hooks/useFavorites';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme';

// Mock the hooks
jest.mock('@/hooks/useGeocoding');
jest.mock('@/hooks/useWeather');
jest.mock('@/hooks/useTemperatureUnit');
jest.mock('@/hooks/useFavorites');
jest.mock('@/hooks/useCityClock', () => ({
	__esModule: true,
	useCityClock: jest.fn().mockImplementation(() => new Date()),
}));

// Mock the date-fns format function
jest.mock('date-fns/format', () => ({
	format: jest.fn(() => '12:00'),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
	useRouter() {
		return {
			push: jest.fn(),
			back: jest.fn(),
		};
	},
}));

// Mock components from WeatherDetail
jest.mock(
	'@/components/weather/WeatherIcon',
	() =>
		function WeatherIcon() {
			return <div data-testid="weather-icon">Weather Icon</div>;
		}
);

// Test wrapper component with theme provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
	<ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('CityWeatherPage', () => {
	const mockCity = {
		city: 'London',
		country: 'UK',
		postcode: 'SW1',
		coordinates: { latitude: 51.5074, longitude: -0.1278 },
		id: 'london-51.507400--0.127800',
	};

	const mockWeatherData = {
		temperature: 37,
		feelsLike: 16,
		minTemp: 15,
		maxTemp: 20,
		humidity: 70,
		pressure: 1015,
		windSpeed: 4.5,
		description: 'Partly cloudy',
		weatherMain: 'Clouds',
		icon: '02d',
		timezone: 3600,
	};

	const mockForecast = [
		{
			time: '2023-06-01T12:00:00Z',
			temperature: 18,
			icon: '02d',
			description: 'Partly cloudy',
		},
		{
			time: '2023-06-01T15:00:00Z',
			temperature: 19,
			icon: '03d',
			description: 'Scattered clouds',
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();

		// Setup mock implementations
		(useGeocoding as jest.Mock).mockReturnValue({
			selectedCity: mockCity,
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

		(useTemperatureUnit as jest.Mock).mockReturnValue({
			unit: 'metric',
			setUnit: jest.fn(),
		});

		(useFavorites as jest.Mock).mockReturnValue({
			favorites: [mockCity],
			addFavorite: jest.fn(),
			removeFavorite: jest.fn(),
			isFavorite: jest.fn().mockReturnValue(false),
			findCityById: jest.fn().mockReturnValue(mockCity),
		});

		// Mock localStorage
		const localStorageMock = {
			getItem: jest.fn(),
			setItem: jest.fn(),
			clear: jest.fn(),
		};
		Object.defineProperty(window, 'localStorage', { value: localStorageMock });
	});

	// Custom render function that includes the theme provider
	const customRender = (ui: React.ReactElement) => {
		return render(ui, { wrapper: TestWrapper });
	};

	it('renders the weather detail page correctly', () => {
		customRender(<CityWeatherPage />);

		// Check city information is displayed
		expect(screen.getByText(/London, UK/i)).toBeInTheDocument();

		// Check weather information
		expect(screen.getByText(/Clouds – Partly cloudy/i)).toBeInTheDocument();
		expect(screen.getByText(/37.0 °C/i)).toBeInTheDocument();

		// Check weather details
		expect(screen.getByText(/Feels Like: 16.0 °C/i)).toBeInTheDocument();
		expect(screen.getByText(/Min: 15.0 °C/i)).toBeInTheDocument();
		expect(screen.getByText(/Max: 20.0 °C/i)).toBeInTheDocument();
		expect(screen.getByText(/Humidity: 70%/i)).toBeInTheDocument();
		expect(screen.getByText(/Pressure: 1015 hPa/i)).toBeInTheDocument();
		expect(screen.getByText(/Wind: 4.5 m\/s/i)).toBeInTheDocument();

		// Check forecast section
		expect(screen.getByText(/Next 24 Hours/i)).toBeInTheDocument();
	});

	it('displays loading state when weather data is being fetched', () => {
		(useWeather as jest.Mock).mockReturnValue({
			weather: null,
			forecast: [],
			error: null,
			isLoading: true,
		});

		customRender(<CityWeatherPage />);

		expect(screen.getByText(/Loading weather data/i)).toBeInTheDocument();
	});

	it('displays error message when weather data fetch fails', () => {
		const errorMessage = 'Failed to fetch weather data';

		(useWeather as jest.Mock).mockReturnValue({
			weather: null,
			forecast: [],
			error: errorMessage,
			isLoading: false,
		});

		customRender(<CityWeatherPage />);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	it('toggles favorite status when star button is clicked', () => {
		const addFavoriteMock = jest.fn();
		const removeFavoriteMock = jest.fn();

		// First render with not favorited
		(useFavorites as jest.Mock).mockReturnValue({
			favorites: [mockCity],
			addFavorite: addFavoriteMock,
			removeFavorite: removeFavoriteMock,
			isFavorite: jest.fn().mockReturnValue(false),
			findCityById: jest.fn().mockReturnValue(mockCity),
		});

		const { rerender } = customRender(<CityWeatherPage />);

		// Find and click the favorite button
		const favoriteButton = screen.getByRole('button', {
			name: /save to favorites/i,
		});
		fireEvent.click(favoriteButton);

		// Check that addFavorite was called
		expect(addFavoriteMock).toHaveBeenCalledWith(
			expect.objectContaining({
				city: 'London',
				id: expect.any(String),
			})
		);

		// Update mock to show favorited state
		(useFavorites as jest.Mock).mockReturnValue({
			favorites: [mockCity],
			addFavorite: addFavoriteMock,
			removeFavorite: removeFavoriteMock,
			isFavorite: jest.fn().mockReturnValue(true),
			findCityById: jest.fn().mockReturnValue(mockCity),
		});

		// Re-render with ThemeProvider
		rerender(
			<ThemeProvider theme={theme}>
				<CityWeatherPage />
			</ThemeProvider>
		);

		// Find and click the unfavorite button
		const unfavoriteButton = screen.getByRole('button', {
			name: /remove from favorites/i,
		});
		fireEvent.click(unfavoriteButton);

		// Check that removeFavorite was called
		expect(removeFavoriteMock).toHaveBeenCalledWith(
			expect.objectContaining({
				city: 'London',
				id: expect.any(String),
			})
		);
	});

	it('displays temperatures with correct unit when unit changes', () => {
		const temperatureUnits = [
			{ unit: 'metric', symbol: '°C' },
			{ unit: 'imperial', symbol: '°F' },
			{ unit: 'standard', symbol: 'K' },
		];

		temperatureUnits.forEach(({ unit, symbol }) => {
			// Update unit in the temperature unit hook
			(useTemperatureUnit as jest.Mock).mockReturnValue({
				unit,
				setUnit: jest.fn(),
			});

			const { unmount } = customRender(<CityWeatherPage />);

			// Check that main temperature is displayed with correct unit
			expect(screen.getByText(`18.0 ${symbol}`)).toBeInTheDocument();

			// Check that other temperatures use correct unit
			expect(
				screen.getByText(`Feels Like: 16.0 ${symbol}`)
			).toBeInTheDocument();
			expect(screen.getByText(`Min: 15.0 ${symbol}`)).toBeInTheDocument();
			expect(screen.getByText(`Max: 20.0 ${symbol}`)).toBeInTheDocument();

			unmount();
		});
	});

	it('handles case when no city is selected', () => {
		// Set selectedCity to null
		(useGeocoding as jest.Mock).mockReturnValue({
			selectedCity: null,
			selectCity: jest.fn(),
			searchCity: jest.fn(),
			suggestions: [],
			error: null,
		});

		customRender(<CityWeatherPage />);

		// The component should render nothing or a placeholder
		expect(screen.queryByText(/London/)).not.toBeInTheDocument();
	});
});
