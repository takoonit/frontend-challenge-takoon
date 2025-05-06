'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { findCityById } from '@/lib/cityUtils';
import { useFavorites } from '@/hooks/useFavorites';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WeatherDetail from '@/components/weather/WeatherDetail';
import { GeocodingResponse } from '@/types/geocoding';

export default function CityDetailPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const id = searchParams.get('id');

	const { favorites } = useFavorites();
	const [loading, setLoading] = useState(true);
	const [city, setCity] = useState<GeocodingResponse | null>(null);

	useEffect(() => {
		if (!id) {
			setLoading(false);
			return;
		}

		// First, try to find the city in favorites from the hook
		if (favorites.length > 0) {
			const foundCity = findCityById(id, favorites);
			setCity(foundCity);
			setLoading(false);
		} else {
			// As a fallback, try to get it directly from localStorage
			try {
				const storedFavorites = JSON.parse(
					localStorage.getItem('favoriteCities') || '[]'
				);
				const foundCity = findCityById(id, storedFavorites);
				setCity(foundCity);
			} catch (e) {
				console.error('Error loading favorites from localStorage:', e);
			}
			setLoading(false);
		}
	}, [id, favorites]);

	const handleBack = () => {
		router.push('/');
	};

	if (!id) {
		return (
			<Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
				<Typography variant="h5" color="error" gutterBottom>
					Missing City ID
				</Typography>
				<Typography paragraph>
					No city ID was provided. Please select a city from the home page.
				</Typography>
				<Button
					startIcon={<ArrowBackIcon />}
					variant="contained"
					onClick={handleBack}
				>
					Back to Home
				</Button>
			</Box>
		);
	}

	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '50vh',
				}}
			>
				<CircularProgress />
				<Typography variant="h6" ml={2}>
					Loading city data...
				</Typography>
			</Box>
		);
	}

	if (!city) {
		return (
			<Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
				<Typography variant="h5" color="error" gutterBottom>
					City Not Found
				</Typography>
				<Typography paragraph>
					The city with ID "{id}" could not be found in your favorites.
				</Typography>
				<Button
					startIcon={<ArrowBackIcon />}
					variant="contained"
					onClick={handleBack}
				>
					Back to Home
				</Button>
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
			<Button
				startIcon={<ArrowBackIcon />}
				variant="outlined"
				onClick={handleBack}
				sx={{ mb: 2 }}
			>
				Back to Home
			</Button>
			<WeatherDetail cityOverride={city} />
		</Box>
	);
}
