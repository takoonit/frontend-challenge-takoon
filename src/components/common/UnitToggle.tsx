'use client';
import { ToggleButton, ToggleButtonGroup, Tooltip, Zoom } from '@mui/material';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import { TemperatureUnit } from '@/types/weather';

export default function UnitToggle() {
  const { unit, setUnit } = useTemperatureUnit();

  const handleChange = (_: React.MouseEvent<HTMLElement>, newUnit: TemperatureUnit | null) => {
    if (newUnit) setUnit(newUnit);
  };

  const buttons: { value: TemperatureUnit; label: string; tooltip: string }[] = [
    { value: 'metric', label: '°C', tooltip: 'Celsius' },
    { value: 'imperial', label: '°F', tooltip: 'Fahrenheit' },
    { value: 'standard', label: 'K', tooltip: 'Kelvin' },
  ];

  return (
    <ToggleButtonGroup
      size="small"
      color="secondary"
      value={unit}
      exclusive
      onChange={handleChange}
      aria-label="temperature unit"

    >
      {buttons.map(({ value, label, tooltip }) => (
        <Tooltip key={value} title={tooltip} arrow placement="top">
          <ToggleButton
          className='hover:bg-purple-500'
            value={value}
            aria-label={tooltip}
            centerRipple
          >
            {label}
          </ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  );
}
