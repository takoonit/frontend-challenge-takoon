'use client';
import React from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    IconButton,
    Box,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

import { GeocodingResponse } from '@/types/geocoding';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useFavorites } from '@/hooks/useFavorites';
import { useCityWeather } from '@/hooks/useCityWeather';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import { TemperatureUnitSymbol } from '@/types/weather';
import { useCityClock } from '@/hooks/useCityClock';

type Props = {
    city: GeocodingResponse;
};

export default function CityCard({ city }: Props) {
    const router = useRouter();
    const { selectCity } = useGeocoding();
    const { removeFavorite } = useFavorites();
    const { unit } = useTemperatureUnit();
    const { weather, loading, error } = useCityWeather(city);
    const localTime = useCityClock(weather?.timezone);

    const symbol = TemperatureUnitSymbol[unit];

    const handleSelect = () => {
        selectCity(city);
        router.push('/');
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeFavorite(city);
    };



    return (
        <Card elevation={2}>
            <CardActionArea onClick={handleSelect}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h6">{city.city}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {city.country}
                            </Typography>
                        </Box>
                        <Tooltip title="Remove from Favorites">
                            <IconButton onClick={handleRemove} size="small" color="error">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Box mt={1}>
                        {loading ? (
                            <CircularProgress size={18} />
                        ) : error || !weather ? (
                            <Typography variant="body2" color="error">
                                Failed to load weather
                            </Typography>
                        ) : (
                            <>
                                <Typography variant="body2">
                                    Temp: {weather.temperature.toFixed(1)}{symbol}
                                </Typography>
                                <Typography variant="body2">
                                    {localTime && (
                                        <Typography variant="body2">
                                            Local Time: {localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </Typography>
                                    )}
                                </Typography>
                            </>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
