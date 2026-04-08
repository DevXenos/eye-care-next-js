import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

/**
 * Enhanced Loading Screen
 * Uses theme palette for consistent branding and Flexbox for perfect centering.
 */
export default function LoadingScreen() {
	const theme = useTheme();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh', // Full viewport height centering
				width: '100%',
				backgroundColor: theme.palette.background.default,
				gap: 2, // Space between spinner and text
			}}
		>
			<CircularProgress
				size={50}
				thickness={4}
				sx={{
					color: theme.palette.primary.main
				}}
			/>
			<Typography
				variant="body1"
				sx={{
					color: theme.palette.text.secondary,
					fontWeight: 500,
					letterSpacing: '0.05em',
					textTransform: 'uppercase'
				}}
			>
				Loading...
			</Typography>
		</Box>
	);
}