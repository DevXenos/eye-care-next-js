"use client";

import { ArchiveIcon, EditIcon, UnarchiveIcon, ViewIcon } from "@/constants/icons";
import {
	Box,
	Chip,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import DialogProvider, { Dialog, DialogTrigger } from "@/components/dialog";

import { DateFormats } from "@/types/ProfileType";
import { ProductType } from "@/types/ProductTypes";
import { SalesType } from "@/types/SalesType";
import formatDate from "@/utils/formatDate";
import useAdminAccount from "@/stores/currentUserStore";
import { useMemo } from "react";
import { useProfile } from "@/stores/profileStore";

type Props = {
	sales: SalesType[];
	product: ProductType;
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

export default function ProductViewDialog({
	product,
	sales,
}: Props) {
	const { currentAdmin } = useAdminAccount()
	const { profile } = useProfile(currentAdmin.uid);

	/* =========================
	   FILTER SALES BY PRODUCT
	========================= */

	const productSales = useMemo(() => {
		return sales.filter((sale) =>
			sale.carts?.some(
				(cart) => cart.productId === product.id
			)
		);
	}, [sales, product.id]);

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

	const createdTime = getTime(product.createdAt);
	const updatedTime = getTime(product.updatedAt);

	return (
		<DialogProvider>
			<DialogTrigger component={IconButton}>
				<ViewIcon/>
			</DialogTrigger>

			<Dialog maxWidth="sm">
				<DialogTitle>
					{product.name}
				</DialogTitle>
				<DialogContent>
					<Box sx={{ p: 1 }}>
						{/* Header */}
						<Stack
							direction="row"
							justifyContent="space-between"
						>
							<Box>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{product.brand} • {product.category}
								</Typography>
							</Box>

							<Chip
								label={product.archive ? "Archived" : "Active"}
								color={product.archive ? "default" : "success"}
								size="small"
							/>
						</Stack>

						<Divider sx={{ my: 2 }} />

						<Typography>
							Price: ₱{product.price.toFixed(2)}
						</Typography>

						<Typography>
							Stock: {product.stockQuantity}
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
										profile.dateFormat
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
										profile.dateFormat
									)}
								</Typography>
							)}
						</Stack>
					</Box>
				</DialogContent>
				<DialogActions>
					<DialogTrigger triggerMode="close">Close</DialogTrigger>
				</DialogActions>
			</Dialog>
		</DialogProvider>
	);
}