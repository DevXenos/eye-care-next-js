"use client"

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import PrintableBarcode, { SelectedProductForBarcode } from "../__components/PrintableBarcodes";
import { useCallback, useEffect, useRef, useState } from "react";

import ActionOnTop from "@/components/ui/ActionOnTop";
import AddIcon from "@mui/icons-material/Add";
import ProductCardList from "@/components/products/ProductCardsList";
import { ProductType } from "@/types/ProductTypes";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";

export default function OutletBarcode() {
	const [selectedProducts, setSelectedProducts] = useState<SelectedProductForBarcode[]>([]);

	// Ref for the hidden element we want to print
	const contentRef = useRef<HTMLDivElement>(null);

	// Initialize the print function pointing to the ref
	const reactToPrintFn = useReactToPrint({
		contentRef,
		documentTitle: "Product_Barcodes",
	});

	const handlePrint = useCallback(() => {
		if (selectedProducts.length > 0) {
			reactToPrintFn();
		}
	}, [reactToPrintFn, selectedProducts]);

	useEffect(() => {
    function action(event: KeyboardEvent) {
        // Check for Ctrl + P ONLY
        const isCtrlP = event.ctrlKey && event.key.toLowerCase() === "p";
        const noOtherModifiers = !event.shiftKey && !event.altKey && !event.metaKey;

        if (isCtrlP && noOtherModifiers) {
            event.preventDefault();
            
            if (selectedProducts.length === 0) {
				toast.error('Please select at least one product to print.');
            } else {
                handlePrint();
            }
        }
    }

    window.addEventListener("keydown", action);

    return () => {
        window.removeEventListener('keydown', action);
    }
}, [handlePrint, selectedProducts.length]);

	const handleProductSelected = (product: ProductType) => {
		setSelectedProducts(prev => {
			const index = prev.findIndex(p => p.product.id === product.id);
			if (index !== -1) {
				const updated = [...prev];
				updated[index] = {
					...updated[index],
					quantity: updated[index].quantity + 1
				};
				return updated;
			}
			return [...prev, { product, quantity: 1 }];
		});
	};

	const increase = (productId: string) => {
		setSelectedProducts(prev =>
			prev.map(p =>
				p.product.id === productId
					? { ...p, quantity: p.quantity + 1 }
					: p
			)
		);
	};

	const decrease = (productId: string) => {
		setSelectedProducts(prev =>
			prev
				.map(p =>
					p.product.id === productId
						? { ...p, quantity: p.quantity - 1 }
						: p
				)
				.filter(p => p.quantity > 0)
		);
	};

	const totalLabels = selectedProducts.reduce((a, b) => a + b.quantity, 0);

	return (
		<Stack sx={{ height: "100%", overflow: "hidden" }}>
			{/* Hidden */}
			<PrintableBarcode
				ref={contentRef}
				selectedProducts={selectedProducts}
			/>

			<ActionOnTop>
				<Button
					variant="contained"
					disabled={!selectedProducts.length}
					sx={{ ml: "auto" }}
					onClick={handlePrint}
				>
					Print ({totalLabels})
				</Button>
			</ActionOnTop>

			{/* Product List Selection */}
			<Box sx={{ flex: 1, overflow: "hidden" }}>
				<ProductCardList
					sx={{ height: "100%" }}
					onProductSelectedAction={handleProductSelected}
				/>
			</Box>

			{/* Bottom Selection Panel */}
			{selectedProducts.length > 0 && (
				<Box
					sx={{
						borderTop: 1,
						borderColor: "divider",
						bgcolor: "background.paper",
						maxHeight: "30%",
						display: "flex",
						flexDirection: "column"
					}}
				>
					<Typography
						variant="subtitle2"
						sx={theme => ({
							position: "sticky",
							top: 0,
							background: theme.palette.background.paper,
							zIndex: 1,
							px: 2,
							py: 1.5,
							borderBottom: `1px solid ${theme.palette.divider}`
						})}
					>
						Selected Products ({selectedProducts.length})
					</Typography>

					<Box sx={{ overflow: "auto", px: 2, py: 1 }}>
						<Stack spacing={1}>
							{selectedProducts.map(({ product, quantity }) => (
								<Stack
									key={product.id}
									direction="row"
									alignItems="center"
									spacing={1}
								>
									<Typography sx={{ flex: 1 }}>
										{product.name}
									</Typography>

									<IconButton size="small" onClick={() => decrease(product.id)}>
										<RemoveIcon fontSize="small" />
									</IconButton>

									<Typography sx={{ width: 24, textAlign: "center" }}>
										{quantity}
									</Typography>

									<IconButton size="small" onClick={() => increase(product.id)}>
										<AddIcon fontSize="small" />
									</IconButton>
								</Stack>
							))}
						</Stack>
					</Box>
				</Box>
			)}
		</Stack>
	);
}