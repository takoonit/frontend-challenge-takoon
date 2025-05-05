'use client';
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useWeather } from '@/hooks/useWeather';
import { useGeocoding } from '@/hooks/useGeocoding';
import WeatherIcon from './WeatherIcon';
import { format } from 'date-fns/format';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import { TemperatureUnitSymbol } from '@/types/weather';

export default function WeatherDetail() {
    const { weather, forecast, error, isLoading } = useWeather();
    const { selectedCity } = useGeocoding();
    const { unit } = useTemperatureUnit();
    const symbol = TemperatureUnitSymbol[unit];

    if (!selectedCity) return null;

    if (isLoading) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography>Loading weather data...</Typography>
            </Box>
        );
    }

    if (error || !weather) {
        return (
            <Box textAlign="center" mt={4} color="error.main">
                <Typography>{error || 'Weather data not available.'}</Typography>
            </Box>
        );
    }

    return (
        <Card className="max-w-md mx-auto mt-6 shadow-md">
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {selectedCity.city}, {selectedCity.country}
                </Typography>

                <Typography variant="h6" color="text.secondary">
                    {weather.weatherMain} – {weather.description}
                </Typography>

                <Box display="flex" alignItems="center" mt={2}>
                    <WeatherIcon iconCode={weather.icon} alt={weather.description} />
                    <Typography variant="h4" ml={2}>
                        {weather.temperature.toFixed(1)} {symbol}
                    </Typography>
                </Box>

                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>

                    <Box flex={1}>
                        <Typography variant="body2">Feels Like: {weather.feelsLike.toFixed(1)} {symbol}</Typography>
                        {weather.minTemp != null && (
                            <Typography variant="body2">Min: {weather.minTemp.toFixed(1)} {symbol}</Typography>
                        )}
                        {weather.maxTemp != null && (
                            <Typography variant="body2">Max: {weather.maxTemp.toFixed(1)} {symbol}</Typography>
                        )}
                    </Box>
                    <Box flex={1}>
                        <Typography variant="body2">Humidity: {weather.humidity}%</Typography>
                        <Typography variant="body2">Pressure: {weather.pressure} hPa</Typography>
                        <Typography variant="body2">Wind: {weather.windSpeed.toFixed(1)} m/s</Typography>
                        {weather.rainVolume !== undefined && (
                            <Typography variant="body2">Rain: {weather.rainVolume} mm</Typography>
                        )}
                    </Box>
                </Box>

                <Typography variant="h6" mt={4}>Next 24 Hours</Typography>
                <Box display="flex" overflow="auto" mt={1} gap={2}>
                    {forecast.map((hour) => (
                        <Box
                            key={hour.time}
                            minWidth={80}
                            textAlign="center"
                            border="1px solid #ccc"
                            borderRadius={2}
                            p={1}
                        >
                            <Typography variant="caption">{format(new Date(hour.time), 'HH:mm')}</Typography>
                            <WeatherIcon iconCode={hour.icon} alt={hour.description} size={40} />
                            <Typography variant="body2">{hour.temperature.toFixed(1)} {symbol}</Typography>
                        </Box>
                    ))}
                </Box>

            </CardContent>
        </Card>
    );
}
