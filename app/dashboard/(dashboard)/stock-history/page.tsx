"use client";

import {
	Autocomplete,
	Card,
	CardContent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { ProductType } from "@/types/ProductTypes";
import StockHistorySummary from "./__components/StockHistorySummary";
import useAdminAccount from "@/stores/currentUserStore";
import { useProducts } from "@/stores/productsStore";
import { useProfile } from "@/stores/profileStore";
import { useStockHistory } from "@/stores/stockHistoryStore";

export default function Outlet() {
	const {currentAdmin} = useAdminAccount();
	const { products, getProductById } = useProducts();
	const histories = useStockHistory();
	const { profile } = useProfile(currentAdmin.uid);

	const [selectedProductId, setSelectedProductId] = useState<ProductType['id'] | null>(null);
	const [query, setQuery] = useState<string>("");

	// Get selected product
	const selectedProduct = selectedProductId
		? getProductById(selectedProductId)
		: null;

	// Filter histories by productId
	const filteredHistories = useMemo(() => {
		if (!selectedProductId) return [];
		return histories.filter(
			(history) => history.productId === selectedProductId
		);
	}, [histories, selectedProductId]);

	return (
		<Stack gap={3} p={3} height="100%">
			{/* Search by Product Name but store ID */}
			<Autocomplete
				options={products}
				getOptionLabel={(option) => option.name}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				value={
					selectedProduct
						? selectedProduct
						: null
				}
				inputValue={query}
				onInputChange={(_, value) => setQuery(value)}
				onChange={(_, value) =>
					setSelectedProductId(value ? value.id : null)
				}
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder="Search product history..."
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			{/* Show details only if a product is selected */}
			{selectedProduct ? (
				<StockHistorySummary
					selected={selectedProduct.name}
					products={filteredHistories}
					dateFormat={profile.dateFormat}
				/>
			) : (
				<Card
					variant="outlined"
					sx={{ textAlign: "center", py: 5, opacity: 0.6 }}
				>
					<CardContent>
						<Typography variant="h6">
							Select a product to view its history
						</Typography>
					</CardContent>
				</Card>
			)}
		</Stack>
	);
}