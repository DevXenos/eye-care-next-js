"use client";

import { ProductType } from "@/types/ProductTypes";
import { Box, Paper, Stack, Typography, Chip } from "@mui/material";

export const PRODUCT_CARD_HEIGHT = 170;

type Props = {
	product: ProductType;
	onClickAction: (product: ProductType) => Promise<void> | void;
};

export default function ProductCard({ product, onClickAction }: Props) {
	const lowStock = product.stockQuantity <= 5;

	return (
		<Paper
			elevation={1}
			onClick={() => onClickAction(product)}
			sx={{
				p: 2,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				gap: 1,
				cursor: "pointer",
				position: "relative",
				userSelect: "none",

				borderRadius: 3,

				transition: "all 0.18s ease",

				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: 4,
					bgcolor: "action.hover"
				}
			}}
		>
			{/* Product Name */}
			<Typography
				textAlign="center"
				fontWeight={600}
				variant="body1"
				sx={{
					lineHeight: 1.3,
					display: "-webkit-box",
					WebkitLineClamp: 2,
					WebkitBoxOrient: "vertical",
					overflow: "hidden"
				}}
			>
				{product.name}
			</Typography>

			{/* Brand */}
			<Typography
				variant="caption"
				color="text.secondary"
				textAlign="center"
			>
				{product.brand || "No Brand"}
			</Typography>

			{/* Spacer */}
			<Box flex={1} />

			{/* Bottom Row */}
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				gap={1}
			>
				{/* Price */}
				<Typography
					variant="h6"
					fontWeight={700}
					color="primary.main"
				>
					₱{product.price}
				</Typography>

				{/* Stock */}
				<Chip
					size="small"
					label={`${product.stockQuantity} in stock`}
					color={lowStock ? "warning" : "success"}
					variant={lowStock ? "filled" : "outlined"}
				/>
			</Stack>
		</Paper>
	);
}