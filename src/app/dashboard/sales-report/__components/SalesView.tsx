"use client";

import { useMemo } from "react";
import {
	Box,
	Typography,
	Stack,
	Divider,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@mui/material";
import { SalesType } from "@/types/SalesType";
import { DateFormats } from "@/types/ProfileType";
import formatDate from "@/utils/formatDate";

type Props = SalesType & {
	dateFormat: DateFormats;
};

function getTime(value: unknown): number | null {
	if (!value) return null;
	if (value instanceof Date) return value.getTime();
	if (
		typeof value === "object" &&
		value !== null &&
		"toMillis" in value &&
		typeof (value as any).toMillis === "function"
	) {
		return (value as any).toMillis();
	}
	if (typeof value === "string") {
		const date = new Date(value);
		return isNaN(date.getTime()) ? null : date.getTime();
	}
	return null;
}

export default function SalesReportView({
	id,
	customerName,
	carts,
	totalAmount,
	createdAt,
	dateFormat,
}: Props) {

	/* =========================
		LOGIC: ITEM COUNT
	========================= */
	const totalItems = useMemo(() => {
		return carts.reduce((acc, item) => acc + item.quantity, 0);
	}, [carts]);

	const createdTime = getTime(createdAt);

	return (
		<Box sx={{ p: 1 }}>
			{/* Header */}
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
			>
				<Box>
					<Typography variant="h6" fontWeight={600}>
						{id}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Customer: {customerName || "Walk-in Customer"}
					</Typography>
				</Box>

				<Typography variant="h6" fontWeight={700} color="primary.main">
					₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
				</Typography>
			</Stack>

			<Divider sx={{ my: 2 }} />

			<Typography variant="body2" fontWeight={600}>
				Summary
			</Typography>
			<Typography variant="body2">
				Total Unique Items: {carts.length}
			</Typography>
			<Typography variant="body2">
				Total Quantity: {totalItems}
			</Typography>

			<Divider sx={{ my: 2 }} />

			{/* Cart Table */}
			<Typography fontWeight={600} mb={1}>
				Items Purchased
			</Typography>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>Product</TableCell>
						<TableCell align="center">Qty</TableCell>
						<TableCell align="right">Price</TableCell>
						<TableCell align="right">Subtotal</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{carts.map((item, index) => (
						<TableRow key={`${item.productId}-${index}`}>
							<TableCell>
								<Typography variant="body2">{item.name}</Typography>
							</TableCell>
							<TableCell align="center">{item.quantity}</TableCell>
							<TableCell align="right">
								₱{item.price.toFixed(2)}
							</TableCell>
							<TableCell align="right" sx={{ fontWeight: 600 }}>
								₱{(item.price * item.quantity).toFixed(2)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Divider sx={{ my: 2 }} />

			{/* Footer / Timestamp */}
			<Stack spacing={0.5}>
				{createdTime && (
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Transaction Date:{" "}
						{formatDate(createdTime, dateFormat)}
					</Typography>
				)}
				<Typography
					variant="caption"
					color="text.secondary"
				>
					Reference ID: {id}
				</Typography>
			</Stack>
		</Box>
	);
}