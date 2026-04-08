"use client"

import { Box, Button, Container, Typography, useTheme } from '@mui/material';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
	const theme = useTheme();
	const navigate = useRouter();

	return (
		<Container maxWidth="md">
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '80vh',
					textAlign: 'center',
					// Primary background color (60% of the visual space)
					bgcolor: theme.palette.background.default,
					color: theme.palette.text.primary,
					padding: 4,
				}}
			>
				<Typography
					variant="h1"
					sx={{
						fontSize: { xs: '6rem', md: '10rem' },
						fontWeight: 800,
						// Secondary color for the main heading (30%)
						color: theme.palette.secondary.main,
						lineHeight: 1,
						mb: 2,
					}}
				>
					404
				</Typography>

				<Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
					Oops! Page Not Found
				</Typography>

				<Typography
					variant="body1"
					sx={{
						color: theme.palette.text.secondary,
						maxWidth: '500px',
						mb: 4
					}}
				>
					The page you are looking for might have been removed, had its name changed,
					or is temporarily unavailable.
				</Typography>

				<Button
					variant="contained"
					size="large"
					onClick={() => navigate.replace('/')}
					sx={{
						px: 5,
						py: 1.5,
						borderRadius: '8px',
						textTransform: 'none',
						fontSize: '1.1rem',
						// Accent color for the action (10%)
						backgroundColor: theme.palette.primary.main,
						'&:hover': {
							backgroundColor: theme.palette.primary.dark,
						},
					}}
				>
					Back to Home
				</Button>
			</Box>
		</Container>
	);
}