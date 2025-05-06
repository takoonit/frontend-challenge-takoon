'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = {
	label?: string;
	to?: string;
};

export default function BackButton({
	label = 'Back to Home',
	to = '/',
}: Props) {
	const router = useRouter();

	const handleClick = () => {
		router.push(to);
	};

	return (
		<Button
			onClick={handleClick}
			variant="outlined"
			startIcon={<ArrowBackIcon />}
			sx={{ mb: 2 }}
		>
			{label}
		</Button>
	);
}
