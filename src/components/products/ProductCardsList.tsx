"use client";

import {
	Box,
	Skeleton,
	SxProps,
	Tab,
	Tabs,
	Theme,
	Typography,
	useMediaQuery,
	useTheme
} from "@mui/material";
import ProductCard, { PRODUCT_CARD_HEIGHT } from "./ProductCard";
import { SearchBar, useSearchBar } from "../ui/SearchBar";
import { useEffect, useMemo, useRef, useState } from "react";

import ActionOnTop from "../ui/ActionOnTop";
import { ProductType } from "@/types/ProductTypes";
import { useProducts } from "@/stores/productsStore";

type Props = {
	area?: string;
	sx?: SxProps<Theme>;
	onProductSelectedAction: (product: ProductType) => void;
};

export default function ProductCardList({
	area,
	sx,
	onProductSelectedAction
}: Props) {
	const [query, setQuery] = useSearchBar("");

	const { products, categories } = useProducts();

	const [tabValue, setTabValue] = useState(0);
	const tabsRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	const [skeletonCount, setSkeletonCount] = useState(8);

	const theme = useTheme();
	const isMd = useMediaQuery(theme.breakpoints.up("md"));
	const isLg = useMediaQuery(theme.breakpoints.up("lg"));

	// Dynamic Skeleton Calculation
	useEffect(() => {
		if (gridRef.current) {
			const columns = isLg ? 4 : isMd ? 3 : 1;
			const viewportHeight =
				gridRef.current.clientHeight || window.innerHeight;

			const rowsNeeded = Math.ceil(viewportHeight / PRODUCT_CARD_HEIGHT) + 1;

			// eslint-disable-next-line react-hooks/set-state-in-effect
			setSkeletonCount(rowsNeeded * columns);
		}
	}, [isMd, isLg]);

	// Filter products
	const filteredProducts = useMemo(() => {
		return products.filter((p) => {
			const matchesCategory =
				tabValue === 0 || p.category === categories[tabValue - 1];

			const lowerQuery = query.toLowerCase();

			const matchesSearch =
				p.name.toLowerCase().includes(lowerQuery) ||
				(p.brand && p.brand.toLowerCase().includes(lowerQuery)) ||
				(p.barcode && p.barcode.includes(query));

			return matchesCategory && matchesSearch;
		});
	}, [products, tabValue, categories, query]);

	const handleWheel = (e: React.WheelEvent) => {
		const container = tabsRef.current?.querySelector(".MuiTabs-scroller");

		if (container) {
			container.scrollLeft += e.deltaY;
		}
	};

	return (
		<Box
			sx={{
				gridArea: area,
				display: "flex",
				flexDirection: "column",
				height: "100%",
				minHeight: 0,
				overflow: "hidden",
				bgcolor: "background.default",
				...sx
			}}
		>
			{/* Search */}
			<ActionOnTop>
				<SearchBar
					placeholder="Search Product..."
					value={query}
					onChange={setQuery}
				/>
			</ActionOnTop>

			{/* Category Tabs */}
			<Box
				onWheel={handleWheel}
				sx={{
					borderBottom: 1,
					borderColor: "divider",
					bgcolor: "background.paper",

					"& .MuiTabs-scroller": {
						scrollbarWidth: "none",
						"&::-webkit-scrollbar": { display: "none" }
					}
				}}
			>
				<Tabs
					ref={tabsRef}
					value={tabValue}
					onChange={(_, v) => setTabValue(v)}
					variant="scrollable"
					scrollButtons="auto"
					allowScrollButtonsMobile
				>
					<Tab label="All" />

					{categories.map((category, index) => (
						<Tab key={index} label={category} />
					))}
				</Tabs>
			</Box>

			{/* Product Grid */}
			<Box
				ref={gridRef}
				sx={{
					flexGrow: 1,
					minHeight: 0,
					overflowY: "auto",
					p: 2,

					display: "grid",
					gap: 2,

					gridTemplateColumns: {
						md: "repeat(2, 1fr)",
						lg: "repeat(4, 1fr)"
					},

					gridAutoRows: PRODUCT_CARD_HEIGHT,
					gridAutoFlow: "row",

					// FORCE ITEMS TO TOP
					alignContent: "start",
					alignItems: "start",
					placeContent: "start",
					justifyContent: "start"
				}}
			>
				{filteredProducts.length > 0 ? (
					filteredProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onClickAction={onProductSelectedAction}
						/>
					))
				) : (
					<Box
						sx={{
							gridColumn: "1 / -1",
							textAlign: "center",
							mt: 10
						}}
					>
						<Typography color="text.secondary">
							No products found matching your criteria.
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}