"use client"

import { Button, FormControlLabel, Stack, Switch } from "@mui/material";
import { SearchBar, useSearchBar } from "@/components/ui/SearchBar";

import ActionOnTop from "@/components/ui/ActionOnTop";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { PrintIcon } from "@/constants/icons";
import ProductForm from "@/app/dashboard/inventory/__components/ProductForm";
import { TableWithSkeleton } from "./__components/InventoryTable";
import { useAdmin } from "../AdminWrapper";
import { useCallback } from "react";
import { useDialog } from "@/providers/DialogProvider";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProducts } from "@/stores/productsStore";
import { useProfile } from "@/stores/profileStore";

export default function Outlet() {
	const currentAdmin = useAdmin();
	const { profile } = useProfile(currentAdmin.uid);
	const { openDialog, removeDialog } = useDialog();
	const { products, categories, brands } = useProducts();

	const [query, onChangeQuery] = useSearchBar()

	const [showArchive, setShowArchive] = useLocalStorage<boolean>(
		"product-archive",
		false
	);

	// ✅ Filter products based on archive state
	// Normalize query
	const normalizedQuery = query.trim().toLowerCase();

	// Filter products based on archive + search
	const filteredProducts = products.filter((prod) => {
		// Archive filter
		const matchesArchive = showArchive
			? prod.archive
			: !prod.archive;

		// Search filter
		const matchesSearch =
			!normalizedQuery ||
			prod.name.toLowerCase().includes(normalizedQuery) ||
			prod.barcode?.toLowerCase().includes(normalizedQuery) ||
			prod.brand?.toLowerCase().includes(normalizedQuery);

		return matchesArchive && matchesSearch;
	});

	// ✅ Add Product
	const handleAddProductClick = useCallback(() => {
		const dialogId = openDialog(
			<ProductForm
				onCancelAction={() => removeDialog(dialogId)}
				brands={brands}
				categories={categories}
			/>,
			{
				title: "Add Product",
				maxWidth: "sm",
				showCloseButton: false,
				closeOnClickOutside: false,
				onClose: () => removeDialog(dialogId),
			}
		);
	}, [openDialog, brands, categories, removeDialog]);

	return (
		<Stack
			p={2}
			gap={2}
			direction="column"
			sx={{ height: "100%", overflow: "hidden" }}
		>
			<ActionOnTop>
				{/* Archive Switch */}
				<FormControlLabel
					control={
						<Switch
							checked={showArchive}
							onChange={(e) => setShowArchive(e.target.checked)}
						/>
					}
					label={showArchive ? "Showing Archived" : "Showing Active"}
				/>

				<SearchBar
					value={query}
					onChange={onChangeQuery}
				/>

				{/* Add Button */}
				<Button
					variant="outlined"
					startIcon={<AddIcon />}
					onClick={handleAddProductClick}
				>
					Add Product
				</Button>

				{/* Print Button */}
				<Button
					LinkComponent={Link}
					href="/dashboard/inventory/barcodes"
					variant="outlined"
					startIcon={<PrintIcon />}
				>
					Print Barcode
				</Button>
			</ActionOnTop>

			{/* Table */}
			<TableWithSkeleton
				dateFormat={profile.dateFormat}
				products={filteredProducts}
			/>
		</Stack>
	);
}