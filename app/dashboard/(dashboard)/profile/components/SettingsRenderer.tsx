"use client"

import { Box, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { RenderInputParam, SettingsItem } from '@/app/dashboard/(dashboard)/profile/utils/settings-data';

export default function SettingsRenderer({
	setting,
	param,
	// onChange
}: {
	setting: SettingsItem;
		param: RenderInputParam;
	// onChange: RenderInputOnChange
}) {
	const columnSize = setting.fullWidth ? 12 : 6;

	return (
		<Grid size={{ xs: 12, md: columnSize }}>
			<Card
				variant="outlined"
				sx={{ height: "100%", display: "flex", flexDirection: "column" }}
			>
				<Box sx={{ p: 1.5, px: 2, bgcolor: "action.hover" }}>
					<Typography variant="subtitle2" fontWeight={700}>
						{setting.title}
					</Typography>
				</Box>

				<Divider />

				<CardContent sx={{ flexGrow: 1 }}>
					<Stack spacing={2} height="100%" justifyContent="space-between">
						<Typography variant="body2" color="text.secondary">
							{setting.desc}
						</Typography>

						<Box
							sx={{
								display: "flex",
								justifyContent: setting.fullWidth
									? "flex-start"
									: "flex-end",
								width: "100%"
							}}
						>
							{setting.renderInput({
								...param,
								// onChange
							})}
						</Box>
					</Stack>
				</CardContent>
			</Card>
		</Grid>
	);
}