// UnitToggle.tsx
'use client';
import React from 'react';
import { ButtonGroup, Button, Tooltip } from '@mui/material';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import { TemperatureUnit } from '@/types/weather';

export default function UnitToggle() {
	const { unit, setUnit } = useTemperatureUnit();

	const units = [
		{ value: 'metric', label: '°C', tooltip: 'Celsius' },
		{ value: 'imperial', label: '°F', tooltip: 'Fahrenheit' },
		{ value: 'standard', label: 'K', tooltip: 'Kelvin' },
	];

	return (
		<ButtonGroup size="small" aria-label="temperature unit selection">
			{units.map((unitOption) => (
				<Tooltip key={unitOption.value} title={unitOption.tooltip}>
					<Button
						onClick={() => setUnit(unitOption.value as TemperatureUnit)}
						variant={unit === unitOption.value ? 'contained' : 'outlined'}
						color="secondary"
						sx={{ minWidth: '36px' }}
					>
						{unitOption.label}
					</Button>
				</Tooltip>
			))}
		</ButtonGroup>
	);
}
