import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CitySearchBar from '@/components/search/CitySearchBar';
import { useGeocoding } from '@/hooks/useGeocoding';

// Mock the useGeocoding hook
jest.mock('@/hooks/useGeocoding');

describe('CitySearchBar', () => {
  const mockSearchCity = jest.fn();
  const mockSelectCity = jest.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (useGeocoding as jest.Mock).mockReturnValue({
      suggestions: [],
      searchCity: mockSearchCity,
      selectCity: mockSelectCity,
      error: null
    });
  });

  it('renders the search bar correctly', () => {
    render(<CitySearchBar />);
    expect(screen.getByPlaceholderText('City/Zip Code')).toBeInTheDocument();
  });

  it('calls searchCity when input changes', () => {
    render(<CitySearchBar />);
    const input = screen.getByPlaceholderText('City/Zip Code');
    
    fireEvent.change(input, { target: { value: 'London' } });
    expect(mockSearchCity).toHaveBeenCalledWith('London');
  });

  it('displays suggestions when available', () => {
    // Mock suggestions
    (useGeocoding as jest.Mock).mockReturnValue({
      suggestions: [
        { city: 'London', country: 'UK', postcode: 'SW1', coordinates: { longitude: 0, latitude: 51 } },
        { city: 'Songkla', country: 'Canada', postcode: 'N6A', coordinates: { longitude: -81, latitude: 42 } }
      ],
      searchCity: mockSearchCity,
      selectCity: mockSelectCity,
      error: null
    });

    render(<CitySearchBar />);
    const input = screen.getByPlaceholderText('City/Zip Code');
    
    // Open dropdown
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    
    // Check if suggestions are displayed (city and country/postcode)
    expect(screen.getByText('Songkla')).toBeInTheDocument();
    expect(screen.getByText('Canada, N6A')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('UK, SW1')).toBeInTheDocument();
  });

  it('calls selectCity when a suggestion is selected', async () => {
    const mockSuggestions = [
      { city: 'London', country: 'UK', postcode: 'SW1', coordinates: { longitude: 0, latitude: 51 } }
    ];
    
    (useGeocoding as jest.Mock).mockReturnValue({
      suggestions: mockSuggestions,
      searchCity: mockSearchCity,
      selectCity: mockSelectCity,
      error: null
    });

    render(<CitySearchBar />);
    const input = screen.getByPlaceholderText('City/Zip Code');
    
    // Open dropdown and select option
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.click(screen.getByText('London'));
    
    expect(mockSelectCity).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it('displays API error message', () => {
    // Mock API error state
    (useGeocoding as jest.Mock).mockReturnValue({
      suggestions: [],
      searchCity: mockSearchCity,
      selectCity: mockSelectCity,
      error: 'API error: Service unavailable'
    });

    render(<CitySearchBar />);
    
    // Check if API error message is displayed
    expect(screen.getByText('API error: Service unavailable')).toBeInTheDocument();
  });
});
