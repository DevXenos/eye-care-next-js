"use client";

import { Box, List, Paper, Stack, Typography, useTheme } from "@mui/material";
import {
	DashboardIcon,
	InventoryIcon,
	POSIcon,
	ProfileIcon,
	PurchaseIcon,
	SalesReportIcon,
	StockHistoryIcon,
	SupplierIcon
} from "@/constants/icons";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { MenuType } from "@/types/MenuTypes";
import { Route } from "next";
import SidebarItem from "./SidebarItem";

export type SidebarItemType = {
	icon: React.ReactNode;
	label: string;
	path: Route;
};

const items: SidebarItemType[] = [
	{ icon: <DashboardIcon />, label: "Overview", path: "/dashboard/overview" },
	{ icon: <POSIcon />, label: "POS", path: "/dashboard/pos" },
	{ icon: <InventoryIcon />, label: "Inventory", path: "/dashboard/inventory" },
	{ icon: <StockHistoryIcon />, label: "Stock History", path: "/dashboard/stock-history" },
	{ icon: <SupplierIcon />, label: "Suppliers", path: "/dashboard/suppliers" },
	{ icon: <PurchaseIcon />, label: "Purchase", path: "/dashboard/purchase" },
	{ icon: <SalesReportIcon />, label: "Sales Report", path: "/dashboard/sales-report" },
	{ icon: <ProfileIcon />, label: "Profile", path: "/dashboard/profile" },
];

export default function SideBar({ area, isOpen }: { area: string; } & MenuType) {
	const pathName = usePathname();
	const theme = useTheme();

	// Sidebar width and collapsed state
	const sidebarWidth = isOpen ? 300 : 80;
	const isCollapsed = !isOpen;

	const mainItems = items.filter((i) => i.path !== "/dashboard/profile");
	const profileItem = items.find((i) => i.path === "/dashboard/profile")!;

	const SidebarContent = (
		<Paper
			elevation={0}
			sx={{
				width: sidebarWidth,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 2,
				p: isCollapsed ? 1 : 3,
				transition: theme.transitions.create(['width', 'padding'], {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.standard,
				}),
				borderRight: "1px solid",
				borderColor: "divider",
				overflowX: "hidden",
				backgroundImage: 'none',
			}}
		>
			{/* Branding */}
			<Box sx={{
				mb: 4,
				textAlign: isCollapsed ? "center" : "left",
				px: isCollapsed ? 0 : 1,
				whiteSpace: "nowrap"
			}}>
				<Typography
					variant="h6"
					fontWeight={800}
					color="primary"
					sx={{ transition: "opacity 0.2s", opacity: 1 }}
				>
					{isCollapsed ? "D" : "DASHBOARD"}
				</Typography>
			</Box>

			{/* Main Navigation */}
			<List sx={{ flexGrow: 1 }}>
				{mainItems.map((item) => (
					<SidebarItem
						key={item.path}
						{...item}
						selected={pathName.startsWith(item.path)}
						isIconOnly={isCollapsed}
					/>
				))}
			</List>

			{/* Profile at the bottom */}
			<Stack sx={{
				mt: "auto",
				pt: 2,
				borderTop: "1px solid",
				borderColor: "divider",
				alignItems: isCollapsed ? "center" : "stretch"
			}}>
				<SidebarItem
					{...profileItem}
					selected={pathName.startsWith(profileItem.path)}
					isIconOnly={isCollapsed}
				/>
			</Stack>
		</Paper>
	);

	return (
		<Box
			component="nav"
			sx={{
				gridArea: area,
				width: sidebarWidth,
				transition: theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.standard,
				}),
			}}
		>
			{SidebarContent}
		</Box>
	);
}