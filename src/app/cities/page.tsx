'use client';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { useFavorites } from '@/hooks/useFavorites';
import CityCard from '@/components/city/CityCard';
import { Star } from '@mui/icons-material';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Favorite Cities
      </Typography>

      {favorites.length === 0 ? (
        <Typography>No favorite cities yet. Add some location! <Star /></Typography>
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
  );
}
