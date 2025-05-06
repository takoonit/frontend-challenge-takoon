'use client';
import CityCard from '@/components/city/CityCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Star } from '@mui/icons-material';
import { Container, Typography, Grid, Box } from '@mui/material';
import { useEffect } from 'react';

export default function Home() {
	const { favorites } = useFavorites();
	useEffect(() => {
		console.log('Current favorites:', favorites);
		console.log(
			'LocalStorage content:',
			localStorage.getItem('favoriteCities')
		);
	}, [favorites]);

	return (
		<>
			<Container maxWidth="md" sx={{ pt: 4 }}>
				{favorites.length === 0 ? (
					<Typography>
						No favorite cities yet. Add some location! <Star />
					</Typography>
				) : (
					<Grid container spacing={2}>
						{favorites.map((city) => (
							<Box key={`${city.city}-${city.coordinates.latitude}`}>
								<CityCard city={city} />
							</Box>
						))}
					</Grid>
				)}
			</Container>
		</>
	);
}
