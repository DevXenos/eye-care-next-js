"use client"

import { InventoryIcon, WarningIcon, CancelIcon } from "@/constants/icons"
import { ProductType } from "@/types/ProductTypes"
import Grid from "@/components/ui/Grid";
import CardItem from "./CardItem";

export default function CardSummary({ products }: {
	products: ProductType[];
}) {

	const totalProducts = products.length;

	const totalStock = products.reduce(
		(sum, product) => sum + (product.stockQuantity ?? 0),
		0
	);

	const lowStock = products.filter(
		(product) =>
			(product.stockQuantity ?? 0) > 0 &&
			(product.stockQuantity ?? 0) <= 10
	).length;

	const outOfStock = products.filter(
		(product) => (product.stockQuantity ?? 0) === 0
	).length;

	return (
		<>
			<Grid container spacing={2} xs={12}>
				<CardItem
					label="Total Products"
					Icon={<InventoryIcon />}
					value={totalProducts}
					color="primary"
				/>

				<CardItem
					label="Total Stock"
					Icon={<InventoryIcon />}
					value={totalStock}
					color="info"
				/>

				<CardItem
					label="Low Stock"
					Icon={<WarningIcon />}
					value={lowStock}
					color="warning"
				/>

				<CardItem
					label="Out of Stock"
					Icon={<CancelIcon />}
					value={outOfStock}
					color="error"
				/>
			</Grid>
		</>
	)
}