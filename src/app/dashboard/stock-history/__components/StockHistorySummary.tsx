"use client"

import { Card, CardContent, Typography } from "@mui/material";
import StockSummaryGrid, { StockSummaryItem } from "../__components/StockSummaryGrid";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"; // Out
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"; // In
import ArticleIcon from "@mui/icons-material/Article";
import { DateFormats } from "@/types/ProfileType";
import Inventory2Icon from "@mui/icons-material/Inventory2"; // Total Quantity
import { StockHistoryType } from "@/types/StockHistoryTypes";
import StockSummaryTable from "./StockSummaryTable";
import { useMemo } from "react";

// Total Records

type StockHistorySummaryProps = {
	selected: string | null;
	products: StockHistoryType[];
	dateFormat: DateFormats;
}

export default function StockHistorySummary({ selected, products, dateFormat }: StockHistorySummaryProps) {
	const totalQuantity = products.reduce(
		(sum, h) => sum + h.quantity,
		0
	);
	const inQuantity = products
		.filter((h) => h.quantity > 0)
		.reduce((sum, h) => sum + h.quantity, 0);

	const outQuantity = products
		.filter((h) => h.quantity < 0)
		.reduce((sum, h) => sum + Math.abs(h.quantity), 0);

	const items = useMemo(() => [
		{
			label: "Total Records",
			value: products.length,
			Icon: <ArticleIcon fontSize="large" color="primary" />
		},
		{
			label: "Total Quantity",
			value: totalQuantity,
			Icon: <Inventory2Icon fontSize="large" color="secondary" />
		},
		{
			label: "In",
			value: inQuantity,
			Icon: <ArrowUpwardIcon fontSize="large" sx={{ color: 'green' }} />,
			color: 'green'
		},
		{
			label: "Out",
			value: outQuantity,
			Icon: <ArrowDownwardIcon fontSize="large" sx={{ color: 'red' }} />,
			color: 'red'
		}
	] as StockSummaryItem[], [products.length, totalQuantity, inQuantity, outQuantity]);

	return products.length > 0 && (
		<>
			{/* Product Card */}
			<Card variant="outlined">
				<CardContent>
					<Typography variant="h6" fontWeight={600}>{selected}</Typography>
				</CardContent>
			</Card>

			<StockSummaryGrid items={items} />
			<StockSummaryTable
				allProducts={products}
				dateFormat={dateFormat}
			/>
		</>
	)
}