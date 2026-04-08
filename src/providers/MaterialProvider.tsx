"use client"

import { lightTheme } from "@/constants/themes/lightTheme";
import { LayoutProp } from "@/types/LayoutProp";
import { CssBaseline, ThemeProvider } from "@mui/material";

export default function MaterialProvider({ children }: LayoutProp) {
	return (
		<ThemeProvider theme={lightTheme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	)
}