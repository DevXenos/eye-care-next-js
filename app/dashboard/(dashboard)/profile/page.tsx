"use client"

import {
	Box,
	Card,
	Grid,
	List,
	ListItemButton,
	ListItemText,
	Stack,
	Tab,
	Tabs,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { SearchBar, useSearchBar } from "@/components/ui/SearchBar";
import { SettingsRegistry, TABS } from "@/app/dashboard/(dashboard)/profile/utils/settings-data";
import { useMemo, useState } from "react";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import SettingsRenderer from "./components/SettingsRenderer";
import useAdminAccount from "@/stores/currentUserStore";
import { useProfile } from "@/stores/profileStore";

export default function SettingsPage() {
	const {currentAdmin} = useAdminAccount();
	const {profile} = useProfile(currentAdmin.uid);

	const [searchQuery, onChangeQuery, clearQuery] = useSearchBar();

	const theme = useTheme();
	const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
	const [activeTab, setActiveTab] = useState(0);

	const searchResults = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return [];

		return SettingsRegistry.filter(
			(item) =>
				item.title.toLowerCase().includes(query) ||
				item.desc.toLowerCase().includes(query)
		);
	}, [searchQuery]);

	const handleJumpToSetting = (tabIndex: number) => {
		setActiveTab(tabIndex);
		clearQuery();
	};

	// Handle of item update/change
	// const handleChange: RenderInputOnChange = (name, value) => {
	// 	toast.promise(
	// 		updateProfile(currentAdmin.uid, {
	// 			[name]: value
	// 		}),
	// 		{
	// 			loading: "Updating...",
	// 			success: "Updated",
	// 			error: (e) => (e as Error).message
	// 		})
	// }

	return (
		<Stack sx={{ p: 2, maxHeight: "100%", overflow: "hidden" }}>
			<SearchBar value={searchQuery} onChange={onChangeQuery} />
			<Box
				sx={{
					display: "flex",
					flexDirection: isTablet ? "column" : "row",
					// height: "100%",
					gap: 3,
					p: { xs: 2, md: 3, },
					overflow: "auto",
				}}
			>

				{/* Sidebar Tabs */}
				{!searchQuery && (
					<Box
						sx={{
							borderRight: isTablet ? 0 : 1,
							borderBottom: isTablet ? 1 : 0,
							borderColor: "divider",
							minWidth: 220
						}}
					>
						<Tabs
							orientation={isTablet ? "horizontal" : "vertical"}
							variant={isTablet ? "scrollable" : "standard"}
							value={activeTab}
							onChange={(_, v) => setActiveTab(v)}
							sx={{
								"& .MuiTabs-indicator": {
									left: isTablet ? "auto" : 0,
									width: isTablet ? "auto" : "3px"
								}
							}}
						>
							{TABS.map((label) => (
								<Tab
									key={label}
									label={label}
									sx={{
										alignItems: isTablet ? "center" : "flex-start",
										minHeight: 48
									}}
								/>
							))}
						</Tabs>
					</Box>
				)}

				{/* Content */}
				<Box sx={{ flex: 1, overflowY: "auto" }}>
					{searchQuery ? (
						<Stack gap={2}>
							<Typography variant="body2" color="text.secondary">
								Search Results for &quot;{searchQuery}&quot;
							</Typography>

							{searchResults.length > 0 ? (
								<List>
									{searchResults.map((item) => (
										<Card key={item.id} variant="outlined" sx={{ mb: 1 }}>
											<ListItemButton
												onClick={() => handleJumpToSetting(item.tab)}
											>
												<ListItemText
													primary={item.title}
													secondary={`Found in ${TABS[item.tab]} Settings`}
												/>
											</ListItemButton>
										</Card>
									))}
								</List>
							) : (
								<Stack alignItems="center" py={10} color="text.secondary">
									<SearchOffIcon sx={{ fontSize: 48, mb: 1 }} />
									<Typography>No settings match your search.</Typography>
								</Stack>
							)}
						</Stack>
					) : (
						<Stack gap={3}>
							<Typography variant="h5" fontWeight={700}>
								{TABS[activeTab]} Settings
							</Typography>

							<Grid container spacing={2}>
								{SettingsRegistry.filter(
									(item) => item.tab === activeTab
								).map((setting) => (
									<SettingsRenderer
										key={setting.id}
										setting={setting}
										param={{
											uid: currentAdmin?.uid??"",
											...profile
										}}
										// onChange={handleChange}
									/>
								))}
							</Grid>
						</Stack>
					)}
				</Box>
			</Box>
		</Stack>
	);
}