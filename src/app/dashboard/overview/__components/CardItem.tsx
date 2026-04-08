"use client"

import Grid from "@/components/ui/Grid";
import { Card, CardContent, Box, Typography } from "@mui/material";
import NumberFlow from "@number-flow/react";

export default function CardItem({
	label,
	Icon,
	value,
	color = "primary",
}: {
	label: string;
	Icon: React.ReactNode;
	value: string | number;
	color?: string;
}) {
	return (
		<Grid md={6} lg={3}>
			<Card
				variant="outlined"
				sx={{
					height: 140,
					borderRadius: 3,
					position: "relative",
					overflow: "hidden",
					transition: "all .2s ease",
					"&:hover": {
						boxShadow: 4,
						transform: "translateY(-3px)",
					},
				}}
			>
				<CardContent
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						height: "100%",
					}}
				>
					{/* Top Row */}
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography
							variant="body2"
							color="text.secondary"
							fontWeight={500}
						>
							{label}
						</Typography>

						<Box
							sx={{
								width: 38,
								height: 38,
								borderRadius: 2,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								bgcolor: `${color}.light`,
								color: `${color}.main`,
							}}
						>
							{Icon}
						</Box>
					</Box>

					{/* Value */}
					<Typography
						variant="h4"
						fontWeight={700}
						sx={{ letterSpacing: 0.5 }}
					>
						{typeof value === "number" ? (
							<NumberFlow value={value}/>
						) : (
							value
						)}
					</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
}