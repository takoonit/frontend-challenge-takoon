import { createTheme } from '@mui/material/styles';

const customComponents = {
	CitySearchBar: {
		style: {
			root: {
				bgcolor: '#fff',
				borderRadius: 8,
				boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
				px: 1,
				py: 0.5,
				minHeight: 48,
				display: 'flex',
				alignItems: 'center',
				overflow: 'hidden',
			},
			input: {
				bgcolor: '#fff',
				borderRadius: 8,
				fontSize: '1rem',
				px: 1,
				py: 0.5,
				width: '100%',
				boxSizing: 'border-box',
				margin: 0,
				'& .MuiOutlinedInput-root': {
					width: '100%',
					boxSizing: 'border-box',
					borderRadius: 8,
					margin: 0,
				},
				'& .MuiOutlinedInput-notchedOutline': {
					border: 'none',
				},
			},
			paper: {
				borderRadius: 8,
				boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
			},
			renderOption: {
				container: {
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					px: 2,
					py: 1,
					width: '100%',
					cursor: 'pointer',
					'&:hover': {
						backgroundColor: 'action.hover',
					},
				},
				city: {
					fontWeight: 600,
					color: 'text.primary',
					fontSize: '1rem',
				},
				countryRow: {
					color: 'text.secondary',
					fontSize: '0.92rem',
					display: 'flex',
					alignItems: 'center',
					gap: 0.5,
				},
			},
		},
	},
};

const theme = createTheme({
	palette: {
		primary: { main: '#0077b6' },
		secondary: { main: '#ff6b6b' },
		background: { default: '#f1f5f9' },
	},
	typography: {
		fontFamily: 'Raleway, Arial, sans-serif',
	},
});

export { customComponents };
export default theme;
