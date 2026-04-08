import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
	palette: {
		mode: "light",
		background: {
			default: "#EDEFFC", // main background
			paper: "#FBFAFF",   // card/paper background
		},
		primary: {
			main: "#5C66DF",    // your primary color
			dark: "#132055",    // darker shade for hover, active, etc.
			light: "#7A85F0",   // lighter variant if needed
			contrastText: "#FFFFFF", // text on primary buttons
		},
		secondary: {
			main: "#FF6B6B",
			contrastText: "#FFFFFF",
		},
		text: {
			primary: "#132055",
			secondary: "#5C66DF",
		},
	},
	typography: {
		fontFamily: "'Inter', sans-serif",
		h1: { fontWeight: 700 },
		h2: { fontWeight: 600 },
		body1: { fontWeight: 400 },
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8, // rounded buttons
					textTransform: "none", // keep button text normal
					minHeight: 45
				},
			},
		},
	},
});