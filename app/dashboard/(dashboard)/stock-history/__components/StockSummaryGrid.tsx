"use client"

import Grid from "@/components/ui/Grid";
import { Card, CardContent, Typography, Box } from "@mui/material";
import NumberFlow from "@number-flow/react";

export type StockSummaryItem = {
	Icon?: React.ReactNode;
	label: string;
	value: number | string;
	color?: string; // optional for styling values
}

export type StockSummaryProps = {
	items: StockSummaryItem[];
}

export default function StockSummaryGrid({ items }: StockSummaryProps) {
	return (
		<Grid container spacing={2}>
			{items.map((item, index) => (
				<Grid
					key={index}
					lg={3}
					md={6}
					sm={12}
					component={Card}
					variant="outlined"
					height={160}
				>
					<CardContent
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 1,
							height: "100%",
							textAlign: "center",
						}}
					>
						{item.Icon && (
							<Box sx={{ fontSize: 40 }}>
								{item.Icon}
							</Box>
						)}
						<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
							{item.label}
						</Typography>
						<Typography
							variant="h5"
							sx={{ fontWeight: 700, color: item.color || "text.primary" }}
						>
							{typeof item.value === 'number' ? <NumberFlow defaultValue={0} value={item.value} /> : item.value}
						</Typography>
					</CardContent>
				</Grid>
			))}
		</Grid>
	)
}