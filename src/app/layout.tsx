import type { Metadata } from "next";
import { Raleway } from 'next/font/google';
import Providers from '@/app/providers';
import { AppBar, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import Header from "@/components/common/Header";
import { GeocodingProvider } from "@/hooks/useGeocoding";
import { WeatherProvider } from "@/hooks/useWeather";
import UnitToggle from '@/components/common/UnitToggle';

const raleway = Raleway({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Weather Better',
  description: 'Check weather forecasts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<html lang="en">
    <body>
      <Providers>
        <GeocodingProvider>
          <WeatherProvider>
            {/* Header */}
            <Header />
						<UnitToggle />
            <main className={raleway.className}>{children}</main>
          </WeatherProvider>
        </GeocodingProvider>
      </Providers>
    </body>
  </html>
  ); 1
}
