"use client"

import { Box, SxProps, Theme } from "@mui/material";

import { CartType } from "@/types/POSTypes";
import ProductCardList from "@/components/products/ProductCardsList";
import { ProductType } from "@/types/ProductTypes";
import TransactionTable from "./__components/TransactionTable";
import { toast } from "sonner";
import { useProducts } from "@/stores/productsStore";
import { useState } from "react";

export default function Outlet() {
	const { getProductById } = useProducts();
	const [carts, setCarts] = useState<CartType[]>([]);

	const handleSelectedProduct = (product: ProductType) => {
		setCarts((prev) => {
			const existingItem = prev.find(item => item.productId === product.id);

			// 1. Check if product is out of stock entirely
			if (product.stockQuantity <= 0) {
				toast.error(`${product.name} is out of stock`);
				return prev;
			}

			// 2. Update existing item
			if (existingItem) {
				if (existingItem.quantity >= product.stockQuantity) {
					toast.warning(`Maximum stock reached for ${product.name}`);
					return prev;
				}

				return prev.map(item =>
					item.productId === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}

			const newItem: CartType = {
				productId: product.id,
				name: product.name,
				price: product.price,
				quantity: 1
			}

			// 3. Add new item
			return [
				...prev,
				newItem
			];
		});
	};

	const handleEditQuantity = (newQuantity: number, index: number) => {
		setCarts((prev) => {
			const updated = [...prev];
			const item = updated[index];

			const product = getProductById(item.productId);

			if (!item) return prev;

			if(product && product.stockQuantity < newQuantity) {
				toast.error('Failed');
				updated[index] = { ...item, quantity: product.stockQuantity };
				return updated;
			}

			updated[index] = { ...item, quantity: newQuantity };
			return updated;
		});
	};

	const handleOnDelete = (index: number) => {
		setCarts((prev) => {
			const newCarts = [...prev]; // Create a shallow copy
			newCarts.splice(index, 1);  // Now it's safe to use splice on the copy
			return newCarts;            // Return the updated copy
		});
	};

	return (
		<Box sx={containerStyle}>
			<ProductCardList
				onProductSelectedAction={handleSelectedProduct}
				area="list"
			/>
			<TransactionTable
				area="transaction"
				carts={carts ?? []}
				onEditQuantityAction={handleEditQuantity}
				onDeleteAction={handleOnDelete}
				onClearAction={() => setCarts([])}
			/>
		</Box>
	);
}

const containerStyle: SxProps<Theme> = {
	display: "grid",
	height: { lg: "100%", md: "auto" },
	gridTemplateColumns: {
		xs: "1fr",
		lg: "1fr 600px"
	},
	gridTemplateRows: {
		xs: "auto 1fr",
		lg: "1fr"
	},
	gridTemplateAreas: {
		xs: `"transaction" "list"`,
		lg: `"list transaction"`
	},
	gap: 2,
	p: 2,
}