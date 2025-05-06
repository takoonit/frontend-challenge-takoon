# WeatherApp

A simple weather application built with **Next.js**, **MUI**, and **Tailwind CSS**.  
Users can search for cities, view detailed weather, and save favorite locations.

## Features

- City Search with Auto-Suggestions
- Weather Details (temp, humidity, wind, rain, etc.)
- Local Time Display
- Save and Manage Favorites
- 24-Hour Forecast
- Temperature Unit Toggle (Kelvin, Celsius, Fahrenheit)

## Tech Stack

- Next.js 14 App Router
- MUI (Material UI) – Main component library
- Tailwind CSS – Layout adjustments
- TypeScript – Type-safe code
- OpenWeatherMap API
- Geoapify API

## Getting Started

1. Clone the repo


2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Create `.env.local` using `.env.example` as a template.

```
NEXT_PUBLIC_GEOCODING_API_KEY=your_geoapify_key
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_key
```

4. Run the development server

```bash
pnpm dev
```

Then open http://localhost:3000

## Project Structure

```
src/
├── components/     # UI components (search, weather card, header)
├── hooks/          # Custom React hooks
├── lib/            # API functions and helpers
├── types/          # TypeScript interfaces
├── pages/          # App routes
├── styles/         # Tailwind + MUI theme
└── config/         # Env & settings
```

## Testing

Basic unit tests using **Jest** and **React Testing Library**.

```bash
pnpm test
```

## Notes

- Free-tier OpenWeatherMap API is used.
- Some features may be rate-limited by API usage.

## License

MIT — free to use and modify.