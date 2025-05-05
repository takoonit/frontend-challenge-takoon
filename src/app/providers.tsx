'use client'; 

import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/theme';

// Wraps the app with the global theme
export default function Providers({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>
        {children}
        </ThemeProvider>;
}