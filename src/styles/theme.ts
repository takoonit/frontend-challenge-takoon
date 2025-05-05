import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0077b6' },
    secondary: { main: '#ff6b6b' },
    background: { default: '#f1f5f9' }
  },
  typography: {
    fontFamily: 'Raleway, Arial, sans-serif',
  },
});

export default theme;