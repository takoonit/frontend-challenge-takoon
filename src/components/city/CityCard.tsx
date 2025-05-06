'use client';
import React from 'react';
import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	CircularProgress,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

import { GeocodingResponse } from '@/types/geocoding';
import { useFavorites } from '@/hooks/useFavorites';
import { useCityWeather } from '@/hooks/useCityWeather';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import { TemperatureUnitSymbol } from '@/types/weather';
import { useCityClock } from '@/hooks/useCityClock';
import { getCityId } from '@/lib/cityUtils';

type Props = {
	city: GeocodingResponse;
};

export default function CityCard({ city }: Props) {
	const router = useRouter();
	const { removeFavorite } = useFavorites();
	const { unit } = useTemperatureUnit();
	const { weather, loading, error } = useCityWeather(city);
	const localTime = useCityClock(weather?.timezone);
	const symbol = TemperatureUnitSymbol[unit];

	const handleCardClick = () => {
		const id = city.id ? city.id : getCityId(city);
		// Instead of a dynamic route, use a query parameter
		router.push(`/city-details?id=${id}`);
	};

	const handleRemove = (e: React.MouseEvent) => {
		// Completely stop event propagation
		e.preventDefault();
		e.stopPropagation();

		// Ensure the city has an ID
		const cityWithId = {
			...city,
			id: city.id || getCityId(city),
		};

		// Remove after a short delay to prevent UI conflicts
		setTimeout(() => {
			removeFavorite(cityWithId);
		}, 0);
	};

	return (
		<Card elevation={2} className="mb-4">
			<Box sx={{ position: 'relative' }}>
				<Box
					onClick={(e) => e.stopPropagation()}
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						zIndex: 2,
						backgroundColor: 'rgba(255,255,255,0.8)',
						borderRadius: '50%',
					}}
				>
					<Tooltip title="Remove from Favorites">
						<IconButton
							onClick={handleRemove}
							size="small"
							color="error"
							sx={{ display: 'block' }}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Box>

				<CardActionArea onClick={handleCardClick}>
					<CardContent>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Box>
								<Typography variant="h6">{city.city}</Typography>
								<Typography variant="body2" color="text.secondary">
									{city.country}
								</Typography>
							</Box>
							<Box width={32} /> {/* Spacer to maintain layout */}
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
										Temp: {weather.temperature.toFixed(1)} {symbol}
									</Typography>
									{localTime && (
										<Typography variant="body2">
											Local Time:{' '}
											{localTime.toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
												second: '2-digit',
											})}
										</Typography>
									)}
								</>
							)}
						</Box>
					</CardContent>
				</CardActionArea>
			</Box>
		</Card>
	);
}