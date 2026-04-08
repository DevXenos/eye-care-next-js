"use client"

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { DateFormats } from "@/types/ProfileType";
import { StockHistoryType } from "@/types/StockHistoryTypes";
import formatDate from "@/utils/formatDate";

function SourcelLabel(source: StockHistoryType['source']) {
	switch (source.type) {
		case "manual":
			return (
				<Typography>{source.note || source.type}</Typography>
			)
		case "pos":
			return (
				<Typography>{source.saleId || source.type}</Typography>
			)
		case "supplier": return source.purchaseId ?? "Purchase";
		default: return "Unknown";
	}
}

type SortKey = 'quantity' | 'date';

export default function StockSummaryTable({
	allProducts,
	dateFormat
}: {
	allProducts: StockHistoryType[];
	dateFormat: DateFormats;
}) {
	const [sortKey, setSortKey] = useState<SortKey>('date');
	const [sortAsc, setSortAsc] = useState(false);

	const sortedProducts = useMemo(() => {
		return [...allProducts].sort((a, b) => {
			let aValue: number, bValue: number;

			if (sortKey === 'quantity') {
				aValue = a.quantity;
				bValue = b.quantity;
			} else {
				aValue = a.createdAt.toMillis();
				bValue = b.createdAt.toMillis();
			}

			if (aValue < bValue) return sortAsc ? -1 : 1;
			if (aValue > bValue) return sortAsc ? 1 : -1;
			return 0;
		});
	}, [allProducts, sortKey, sortAsc]);

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortAsc(!sortAsc);
		} else {
			setSortKey(key);
			setSortAsc(true); // default ascending on new column
		}
	};

	return (
		<Paper sx={{ overflowX: "auto" }}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell>Source</TableCell>
						<TableCell align="right">
							<TableSortLabel
								active={sortKey === 'quantity'}
								direction={sortAsc ? 'asc' : 'desc'}
								onClick={() => handleSort('quantity')}
							>
								Quantity
							</TableSortLabel>
						</TableCell>
						<TableCell align="center">
							<TableSortLabel
								active={sortKey === 'date'}
								direction={sortAsc ? 'asc' : 'desc'}
								onClick={() => handleSort('date')}
							>
								Date
							</TableSortLabel>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedProducts.map((history, index) => (
						<TableRow key={index} hover>
							<TableCell>
								<SourcelLabel {...history.source} />
							</TableCell>

							<TableCell align="right" sx={{ color: history.quantity < 0 ? 'red' : 'green' }}>
								{history.quantity < 0 ? `-${Math.abs(history.quantity)}` : `+${history.quantity}`}
							</TableCell>
							<TableCell align="center">{formatDate(history.createdAt.toMillis(), dateFormat)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Paper>
	)
}