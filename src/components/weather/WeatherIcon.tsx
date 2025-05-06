'use client';
import React from 'react';
import Image from 'next/image';

type WeatherIconProps = {
	iconCode: string;
	alt?: string;
	size?: number;
};

export default function WeatherIcon({
	iconCode,
	alt = '',
	size = 60,
}: WeatherIconProps) {
	const src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

	return (
		<Image
			src={src}
			alt={alt}
			width={size}
			height={size}
			unoptimized // avoids warning from Next.js if image domains not configured
			loading="eager"
		/>
	);
}
