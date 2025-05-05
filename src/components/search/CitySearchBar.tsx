"use client"
import { Autocomplete, Box, TextField } from '@mui/material';
import { useGeocoding } from '@/hooks/useGeocoding';
import { customComponents } from '@/styles/theme';
import { GeocodingResponse } from '@/types/geocoding';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

export default function CitySearchBar() {
    const { suggestions, searchCity, selectCity, error } = useGeocoding();

    // Input change for searching city
    const handleSearchCity = (event: React.ChangeEvent<HTMLInputElement>) => {
        searchCity(event.target.value);
    };

    // Handle city selection
    const handleCitySelection = (
        event: React.SyntheticEvent<Element, Event>,
        value: string | GeocodingResponse | null
    ) => {
        if (value && typeof value !== 'string') {
            // Log for debugging, can be removed
            console.log("Selected:", value);
            selectCity(value);
        }
    };

    // Determine error display
    const errorHelperText = error && !error.startsWith('API error') && !error.includes('Unknown error') ? error : '';

    return (
        // Styled Box for search bar integration in header, using theme customComponents
        <Box sx={customComponents.CitySearchBar.style.root}>
            <Autocomplete
                freeSolo
                options={suggestions}
                isOptionEqualToValue={(option, value) => option.city === value.city && option.country === value.country && option.postcode === value.postcode}
                fullWidth
                // Style the dropdown list using slotProps (MUI v5+)
                slotProps={{
                  paper: { sx: customComponents.CitySearchBar.style.paper }
                }}
                // Custom option rendering for sharp, clean Material look
                renderOption={(props, option) => (
                    <Box
                        component="li"
                        {...props}
                        sx={customComponents.CitySearchBar.style.renderOption.container}
                    >
                        <Box sx={customComponents.CitySearchBar.style.renderOption.countryRow}>
                            <FmdGoodIcon /> <Box sx={customComponents.CitySearchBar.style.renderOption.city}>
                            {option.city}
                        </Box>{option.country}{option.postcode ? `, ${option.postcode}` : ''}
                        </Box>
                    </Box>
                )}
                getOptionLabel={(option: string | GeocodingResponse) => typeof option === 'string' ? option : option.city || ''}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        hiddenLabel
                        placeholder='City/Zip Code'
                        variant="outlined"
                        size="small"
                        sx={customComponents.CitySearchBar.style.input}
                        error={!!error && !error.startsWith('API error') && !error.includes('Unknown error')}
                        helperText={errorHelperText}
                        onChange={handleSearchCity}
                    />
                )}
                onChange={handleCitySelection}
            />
            {/* Show critical errors below the search bar */}
            {error && (error.startsWith('API error') || error.includes('Unknown error')) && (
                <Box mt={2} color="error.main" fontSize="0.95rem" textAlign="center">
                    {error}
                </Box>
            )}
        </Box>
    );
}
