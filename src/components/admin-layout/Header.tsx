"use client"

import { ArrowRightIcon, MenuIcon, POSIcon } from "@/constants/icons";
import { Box, Breadcrumbs, Button, IconButton, MenuItem, Paper, Select, Stack } from "@mui/material";
import { dateFormats, dateFormatsSample } from "@/types/ProfileType";

import { CamelCase } from "@/utils/camelCase";
import Link from "next/link";
import { MenuType } from '@/types/MenuTypes';
import { useAdmin } from "@/app/dashboard/AdminWrapper";
import { usePathname } from "next/navigation";
import { useProfile } from "@/stores/profileStore";

type Props = {
	area: string;
} & MenuType;

export default function Header({ area, isOpen, setOpen }: Props) {
	const currentAdmin = useAdmin();
	
	const { profile, updateProfile } = useProfile(currentAdmin.uid);

	const pathName = usePathname();

	const paths = pathName.replaceAll("/dashboard/", '').split("/");

	return (
		<Paper
			component={Stack}
			direction="row"
			alignItems="stretch"
			sx={{
				gridArea: area,
				p: 1,
				gap: 1,
				height: 65
			}}
		>
			<IconButton
				onClick={() => setOpen(!isOpen)}
				sx={{ height: "100%" }}
			>
				<MenuIcon />
			</IconButton>

			<Breadcrumbs
				separator={<ArrowRightIcon />}
				sx={{ display: "flex", alignItems: "center" }}
			>
				{paths.map((path, index) => {
					const isLastItem = path === paths.at(-1);

					return (
						<Button
							key={index}
							size="small"
							sx={{ height: "100%" }}
							{...(!isLastItem && {
								LinkComponent: Link,
								href: `/dashboard/${path}`,
							})}
						>
							{CamelCase(path)}
						</Button>
					);
				})}
			</Breadcrumbs>

			<Box sx={{ flex: 1 }} />

			{!pathName.includes("pos") && (
				<Stack direction="row" spacing={1} alignItems="stretch">
					<Button
						startIcon={<POSIcon />}
						variant="outlined"
						size="small"
						sx={{ height: "100%" }}
						LinkComponent={Link}
						href="/dashboard/pos"
					>
						POS
					</Button>

					<Select
						size="small"
						value={profile.dateFormat}
						sx={{ height: "100%", minWidth: 140 }}
						onChange={async (e) => {
							await updateProfile(currentAdmin.uid, {
								dateFormat: e.target.value
							});
						}}
					>
						{dateFormats.map((format, index) => (
							<MenuItem key={index} value={format}>
								{dateFormatsSample[format]}
							</MenuItem>
						))}
					</Select>
				</Stack>
			)}
		</Paper>
	)
}