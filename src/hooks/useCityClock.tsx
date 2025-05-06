import { useEffect, useState } from 'react';

/**
 * Returns a ticking Date object adjusted by the given timezone offset in seconds.
 * @param timezone Seconds offset from UTC (e.g. 25200 for UTC+7)
 */
export function useCityClock(timezone: number | undefined) {
	const [localTime, setLocalTime] = useState<Date | null>(null);

	useEffect(() => {
		if (timezone === undefined) return;

		const update = () => {
			const utcNow = Date.now(); // in ms
			const cityTime = new Date(utcNow + timezone * 1000); // shift by provided offset
			setLocalTime(cityTime);
		};

		update();
		const interval = setInterval(update, 10000); // Update time each minute
		return () => clearInterval(interval);
	}, [timezone]);

	return localTime;
}
