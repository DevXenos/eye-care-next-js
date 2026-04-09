"use client"

import { ProductType } from "@/types/ProductTypes";
import { Box, Typography } from "@mui/material";
import { Ref } from "react";
import Barcode from "react-barcode";

export type SelectedProductForBarcode = {
	product: ProductType;
	quantity: number;
};

export type PrintableBarcodeProps = {
	selectedProducts: SelectedProductForBarcode[];
	ref: Ref<HTMLDivElement>;
}

export default function PrintableBarcode({ selectedProducts, ref }: PrintableBarcodeProps) {
	// 1. Calculate the total number of labels to be printed
	const totalLabels = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);

	// 2. Calculate how many empty slots are needed to fill the last row (5 columns)
	const remainder = totalLabels % 5;
	const emptySlots = remainder === 0 ? 0 : 5 - remainder;

	return (
		<Box sx={{ display: "none" }}>
			<div ref={ref} style={{ padding: '10px' }}>
				<style>{`
                    @media print {
                        .barcode-grid {
                            display: grid;
                            grid-template-columns: repeat(5, 1fr); 
                            gap: -1px;
                        }
                        .barcode-card {
                            border: 1px solid #ddd;
                            padding: 5px;
                            text-align: center;
                            page-break-inside: avoid;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            min-height: 80px; /* Ensures empty cards have height */
                        }
                        .empty-card {
                            border: 1px dashed #eee; /* Light dashed border for fillers */
                        }
                    }
                `}</style>

				<div className="barcode-grid">
					{/* Render Actual Barcodes */}
					{selectedProducts.map(({ product, quantity }) => (
						Array.from({ length: quantity }).map((_, i) => (
							<div key={`${product.id}-${i}`} className="barcode-card">
								<Typography
									variant="caption"
									sx={{
										fontSize: '9px', // Reduced slightly for 5-col fit
										fontWeight: 'bold',
										lineHeight: 1.1,
										mb: 0.5,
										width: '100%',
										textAlign: 'center'
									}}
									noWrap
								>
									{product.name}
								</Typography>

								<Barcode
									value={product.barcode}
									text={product.barcode}
									width={1.0}      // Slightly thinner bars for 5-col layout
									height={30}      // Shorter height to keep it compact
									fontSize={9}
									margin={0}
									background="#ffffff"
								/>
							</div>
						))
					))}

					{/* Render Filler/Empty Slots */}
					{Array.from({ length: emptySlots }).map((_, i) => (
						<div key={`empty-${i}`} className="barcode-card empty-card">
							{/* Empty div to maintain grid structure */}
						</div>
					))}
				</div>
			</div>
		</Box>
	)
}