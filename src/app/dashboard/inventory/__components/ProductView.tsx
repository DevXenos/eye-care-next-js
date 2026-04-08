"use client";

import {
	Box,
	Chip,
	Divider,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";

import { DateFormats } from "@/types/ProfileType";
import { ProductType } from "@/types/ProductTypes";
import { SalesType } from "@/types/SalesType";
import formatDate from "@/utils/formatDate";
import { useMemo } from "react";

type Props = ProductType & {
	dateFormat: DateFormats;
	sales: SalesType[];
};

function getTime(value: unknown): number | null {
	if (!value) return null;

	// If already Date
	if (value instanceof Date) {
		return value.getTime();
	}

	// If Firestore Timestamp-like
	if (
		typeof value === "object" &&
		value !== null &&
		"toMillis" in value &&
		typeof (value as { toMillis?: unknown }).toMillis === "function"
	) {
		return (value as { toMillis: () => number }).toMillis();
	}

	// If string
	if (typeof value === "string") {
		const date = new Date(value);
		if (!isNaN(date.getTime())) {
			return date.getTime();
		}
	}

	return null;
}

export default function ProductView({
	id,
	dateFormat,
	name,
	brand,
	category,
	price,
	stockQuantity,
	archive,
	createdAt,
	updatedAt,
	sales,
}: Props) {

	/* =========================
	   FILTER SALES BY PRODUCT
	========================= */

	const productSales = useMemo(() => {
		return sales.filter((sale) =>
			sale.carts?.some(
				(cart) => cart.productId === id
			)
		);
	}, [sales, id]);

	/* =========================
	   GROUP BY CUSTOMER
	========================= */

	const customerCount = useMemo(() => {
		return productSales.reduce<Record<string, number>>(
			(acc, sale) => {
				const customer =
					sale.customerName || "Unknown";

				acc[customer] =
					(acc[customer] || 0) + 1;

				return acc;
			},
			{}
		);
	}, [productSales]);

	const totalSold = productSales.length;

	const createdTime = getTime(createdAt);
	const updatedTime = getTime(updatedAt);

	return (
		<Box sx={{ p: 1 }}>
			{/* Header */}
			<Stack
				direction="row"
				justifyContent="space-between"
			>
				<Box>
					<Typography variant="h6" fontWeight={600}>
						{name}
					</Typography>

					<Typography
						variant="body2"
						color="text.secondary"
					>
						{brand} • {category}
					</Typography>
				</Box>

				<Chip
					label={archive ? "Archived" : "Active"}
					color={archive ? "default" : "success"}
					size="small"
				/>
			</Stack>

			<Divider sx={{ my: 2 }} />

			<Typography>
				Price: ₱{price.toFixed(2)}
			</Typography>

			<Typography>
				Stock: {stockQuantity}
			</Typography>

			<Typography fontWeight={600}>
				Total Sold: {totalSold}
			</Typography>

			<Divider sx={{ my: 2 }} />

			<Typography fontWeight={600} mb={1}>
				Sales By Customer
			</Typography>

			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>Customer</TableCell>
						<TableCell align="right">
							Count
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{Object.entries(customerCount).map(
						([customer, count]) => (
							<TableRow key={customer}>
								<TableCell>
									{customer}
								</TableCell>
								<TableCell align="right">
									{count}
								</TableCell>
							</TableRow>
						)
					)}
				</TableBody>
			</Table>

			<Divider sx={{ my: 2 }} />

			<Stack spacing={0.5}>
				{createdTime && (
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Created:{" "}
						{formatDate(
							createdTime,
							dateFormat
						)}
					</Typography>
				)}

				{updatedTime && (
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Updated:{" "}
						{formatDate(
							updatedTime,
							dateFormat
						)}
					</Typography>
				)}
			</Stack>
		</Box>
	);
}