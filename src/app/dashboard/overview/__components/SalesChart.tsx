"use client";

import { CartType } from "@/types/POSTypes";
import { useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function SalesChart({ sales }: { sales: CartType[] }) {

	const theme = useTheme()

	return (
		<BarChart
			colors={[theme.palette.primary.main]}
			xAxis={[
				{
					scaleType: "band",
					data: sales.map((p) => p.name),
				},
			]}
			series={[
				{
					data: sales.map((p) => p.quantity),
					label: "Items Sold",
				},
			]}
			height={300}
		/>
	);
}