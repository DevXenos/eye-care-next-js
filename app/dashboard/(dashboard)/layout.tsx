"use client"

import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";

import Header from "@/components/admin-layout/Header";
import { KEYS } from "@/constants/keys";
import { LayoutProp } from "@/types/LayoutProp";
import SideBar from "@/components/admin-layout/SideBar";
import { createContext } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

// --- Types ---
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type DashboardContextType = {};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// --- Layout Component ---
export default function DashboardLayout({ children }: LayoutProp) {
	const theme = useTheme();

	const isSmaller = useMediaQuery(theme.breakpoints.down("md"));

	// Menu
	const [isOpen, setOpen] = useLocalStorage<boolean>(KEYS.MENU, true);

	if (isSmaller) {
		return (
			<Box
				sx={{
					height: "100svh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					textAlign: "center",
					p: 3,
					backgroundColor: "background.default",
					color: "text.secondary",
				}}
			>
				<Typography variant="h4" sx={{ mb: 2 }}>
					Dashboard not supported
				</Typography>
				<Typography variant="body1">
					This dashboard works best on a larger screen.
					<br />
					Please use a tablet or desktop for full functionality.
				</Typography>
			</Box>
		);
	}

	return (
		<DashboardContext.Provider value={{}}>
			<Box
				sx={{
					height: "100svh",
					display: "grid",
					gridTemplateRows: "auto 1fr",
					gridTemplateColumns: {
						md: "auto 1fr",
						xs: "1fr",
					},
					gridTemplateAreas: {
						md: `
								"sidebar header"
								"sidebar main"
							`,
						xs: `
								"header"
								"main"
							`,
					},
					gap: 2,
					p: 3,
				}}
			>
				<SideBar area="sidebar" isOpen={isOpen} setOpen={setOpen} />

				<Header
					isOpen={isOpen}
					setOpen={setOpen}
					area="header"
				/>

				<Paper
					component="main"
					sx={{
						overflowY: "auto",
						minHeight: `100%`,
						width: "100%",
						gridArea: "main"
					}}
				>
					{children}
				</Paper>
			</Box>
		</DashboardContext.Provider>
	);
}