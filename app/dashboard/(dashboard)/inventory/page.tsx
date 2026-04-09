"use client"

import { Button, FormControlLabel, Stack, Switch } from "@mui/material";
import { SearchBar, useSearchBar } from "@/components/ui/SearchBar";

import ActionOnTop from "@/components/ui/ActionOnTop";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { PrintIcon } from "@/constants/icons";
import ProductFormDialog from "./__components/ProductFormDialog";
import { TableWithSkeleton } from "./__components/InventoryTable";
import useAdminAccount from "@/stores/currentUserStore";
import { useDialog } from "@/providers/DialogProvider";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProducts } from "@/stores/productsStore";
import { useProfile } from "@/stores/profileStore";

export default function Outlet() {
	const {currentAdmin} = useAdminAccount();
	const { profile } = useProfile(currentAdmin.uid);
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
				<ProductFormDialog icon={<AddIcon />} edit={false}>
					Add Product
				</ProductFormDialog>

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