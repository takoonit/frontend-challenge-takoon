// Header.tsx
import { AppBar, IconButton, Toolbar, Typography, Box } from "@mui/material";
import Link from "next/link";
import React from "react";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CitySearchBar from "../search/CitySearchBar";
import UnitToggle from "./UnitToggle";

const Header = () => (
	<AppBar position="sticky" className="bg-green-700">
		<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
			{/* Left: Logo and App Title */}
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Link href="/" passHref legacyBehavior>
					<IconButton edge="start" color="inherit" aria-label="home">
						<ThermostatIcon fontSize="large" color="secondary" />
					</IconButton>
				</Link>
				<Typography variant="h6" component="span" sx={{ fontWeight: 600, letterSpacing: 1 }}>
					WeatherApp
				</Typography>
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 2,
					flexGrow: 1,
					justifyContent: 'flex-end',
					flexWrap: 'wrap',
				}}
			>
				{/* Center/Right: City Search Bar */}
				<Box sx={{ minWidth: { xs: 120, sm: 220, md: 300 }, flex: 1, maxWidth: 400, ml: 2 }}>
					<CitySearchBar />
				</Box>

				{/* Right: Unit Toggle */}
				<UnitToggle />
			</Box>
		</Toolbar>
	</AppBar>
);

export default Header;