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
	Chip,
} from "@mui/material";
import { PurchaseType } from "@/types/PurchaseTypes";
import { DateFormats } from "@/types/ProfileType";
import formatDate from "@/utils/formatDate";

type Props = PurchaseType & {
	dateFormat: DateFormats;
	supplierName: string;
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

export default function PurchaseView({
	id,
	dateFormat,
	supplierId,
	supplierName,
	orders,
	returns,
	createdAt,
	updatedAt,
}: Props) {

	/* =========================
		LOGIC: TOTALS
	========================= */
	const totalOrderQty = useMemo(() => {
		return orders.products.reduce((acc, p) => acc + p.quantity, 0);
	}, [orders]);

	const totalReceivedQty = useMemo(() => {
		return orders.products.reduce((acc, p) => acc + p.received, 0);
	}, [orders]);

	const createdTime = getTime(createdAt);
	const updatedTime = getTime(updatedAt);

	return (
		<Box sx={{ p: 1 }}>
			{/* Header */}
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
				<Box>
					<Typography variant="h6" fontWeight={600}>
						{id}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Supplier: {supplierName} ({supplierId})
					</Typography>
				</Box>

				<Stack direction="row" spacing={1}>
					<Chip
						label={orders.status}
						color={orders.status === "completed" ? "success" : "warning"}
						size="small"
					/>
					{returns && (
						<Chip
							label={`Returns: ${returns.status}`}
							color={returns.status === "completed" ? "error" : "default"}
							size="small"
							variant="outlined"
						/>
					)}
				</Stack>
			</Stack>

			<Divider sx={{ my: 2 }} />

			<Typography variant="body2">
				Order Progress: {totalReceivedQty} / {totalOrderQty} Items Received
			</Typography>

			<Divider sx={{ my: 2 }} />

			{/* Products Table */}
			<Typography fontWeight={600} mb={1}>
				Ordered Products
			</Typography>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>Product</TableCell>
						<TableCell align="right">Qty</TableCell>
						<TableCell align="right">Received</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{orders.products.map((item) => (
						<TableRow key={item.id}>
							<TableCell>{item.name}</TableCell>
							<TableCell align="right">{item.quantity}</TableCell>
							<TableCell align="right">
								<Typography
									variant="body2"
									fontWeight={600}
									color={item.received < item.quantity ? "error.main" : "success.main"}
								>
									{item.received}
								</Typography>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Returns Table (Only if they exist) */}
			{returns && returns.products.length > 0 && (
				<>
					<Divider sx={{ my: 2 }} />
					<Typography fontWeight={600} mb={1} color="error.main">
						Purchase Returns
					</Typography>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Product</TableCell>
								<TableCell align="right">Condition</TableCell>
								<TableCell align="right">Qty</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{returns.products.map((ret, idx) => (
								<TableRow key={`${ret.id}-${idx}`}>
									<TableCell>{ret.name}</TableCell>
									<TableCell align="right">
										<Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
											{ret.condition}
										</Typography>
									</TableCell>
									<TableCell align="right">{ret.returned}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</>
			)}

			<Divider sx={{ my: 2 }} />

			{/* Timestamps */}
			<Stack spacing={0.5}>
				{createdTime && (
					<Typography variant="caption" color="text.secondary">
						Created: {formatDate(createdTime, dateFormat)}
					</Typography>
				)}
				{updatedTime && (
					<Typography variant="caption" color="text.secondary">
						Last Updated: {formatDate(updatedTime, dateFormat)}
					</Typography>
				)}
			</Stack>
		</Box>
	);
}