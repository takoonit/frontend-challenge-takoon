'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useGeocoding } from '@/hooks/useGeocoding';
import WeatherDetail from '@/components/weather/WeatherDetail';
import BackButton from '@/components/common/BackButton';

export default function CityWeatherPage() {
	const { selectedCity } = useGeocoding();

	return (
		<Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
			{selectedCity ? (
				<>
					<Typography variant="h4" gutterBottom>
						<BackButton />
					</Typography>
					<WeatherDetail />
				</>
			) : (
				<Typography variant="h6" color="text.secondary" textAlign="center">
					No city selected. Please search for a city from the homepage.
				</Typography>
			)}
		</Box>
	);
}
