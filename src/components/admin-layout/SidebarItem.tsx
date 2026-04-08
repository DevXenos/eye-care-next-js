import { ListItemButton, ListItemIcon, ListItemText, Tooltip, Zoom, useTheme } from "@mui/material";

import Link from "next/link";
import { SidebarItemType } from "./SideBar";

export default function SidebarItem({
	icon,
	label,
	path,
	selected,
	isIconOnly, // New prop to hide text
}: SidebarItemType & { selected: boolean; isIconOnly?: boolean, }) {
	const theme = useTheme();

	const Button = (
		<ListItemButton
			LinkComponent={Link}
			selected={selected}
			onClick={(e) => {
				if (selected) return e.preventDefault();
			}}
			href={path}
			sx={{
				maxHeight: 50,
				mb: 1,
				borderRadius: 1,
				justifyContent: isIconOnly ? "center" : "flex-start",
				px: isIconOnly ? 0 : 2,
				pointerEvents: selected ? "none" : "auto",
				"&.Mui-selected": {
					backgroundColor: theme.palette.primary.main,
					color: theme.palette.primary.contrastText,
				},
			}}
		>
			<ListItemIcon
				sx={{
					color: selected
						? theme.palette.primary.contrastText
						: theme.palette.primary.main,
					minWidth: isIconOnly ? 0 : 40,
					justifyContent: "center",
				}}
			>
				{icon}
			</ListItemIcon>
			{!isIconOnly && (
				<ListItemText
					primary={label}
					primaryTypographyProps={{
						fontWeight: selected ? 600 : 400,
						noWrap: true, // Prevents text breaking on small widths
						color: selected
							? theme.palette.primary.contrastText
							: theme.palette.text.primary,
					}}
				/>
			)}
		</ListItemButton>
	);

	return isIconOnly ? (
		<Tooltip
			title={label}
			placement="right"
			arrow
			TransitionComponent={Zoom}
			enterDelay={200}
			slotProps={{
				tooltip: {
					sx: {
						bgcolor: 'primary.main',
						color: 'primary.contrastText',
						fontSize: '0.875rem',
						fontWeight: 600,
						px: 1.5,
						py: 1,
						borderRadius: 1.5,
						boxShadow: theme.shadows[4],
						// Add a border if you want a glassmorphism look
						border: '1px solid',
						borderColor: 'divider',
					},
				},
				arrow: {
					sx: {
						color: 'primary.main', // Must match tooltip bgcolor
					},
				},
			}}
		>
			{Button}
		</Tooltip>
	) : Button;
}