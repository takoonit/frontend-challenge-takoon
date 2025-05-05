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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GeocodingResponse } from '@/types/geocoding';
import { useFavorites } from '@/hooks/useFavorites';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useRouter } from 'next/navigation';

type Props = {
    city: GeocodingResponse;
};

export default function CityCard({ city }: Props) {
    const { removeFavorite } = useFavorites();
    const { selectCity } = useGeocoding();
    const router = useRouter();

    const handleSelect = () => {
        selectCity(city);
        router.push('/');
    };

    return (
        <Card>
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
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    removeFavorite(city);
                                }}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
