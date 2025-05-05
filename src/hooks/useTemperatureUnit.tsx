'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TemperatureUnit } from '@/types/weather';

type TemperatureUnitState = {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
};

const TemperatureUnitContext = createContext<TemperatureUnitState | undefined>(undefined);

export const TemperatureUnitProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnit] = useState<TemperatureUnit>('metric'); // default to Celsius

  return (
    <TemperatureUnitContext.Provider value={{ unit, setUnit }}>
      {children}
    </TemperatureUnitContext.Provider>
  );
};

export function useTemperatureUnit() {
  const context = useContext(TemperatureUnitContext);
  if (!context) {
    throw new Error('useTemperatureUnit must be used within a TemperatureUnitProvider');
  }
  return context;
}
