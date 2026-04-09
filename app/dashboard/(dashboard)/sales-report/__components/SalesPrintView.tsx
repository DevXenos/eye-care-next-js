"use client";

import {
	Box,
	Button,
	Divider,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
/* eslint-disable react-hooks/purity */
import React, { useRef } from "react";

import { DateFormats } from "@/types/ProfileType";
import { SalesType } from "@/types/SalesType";
import formatDate from "@/utils/formatDate";
import formatNumber from "@/utils/formatNumber";
import { useReactToPrint } from "react-to-print";

type Props = {
	sales: SalesType[];
	dateFormat: DateFormats;
	title?: string;
};

export default function SalesPrintView({ sales, dateFormat, title = "Sales Report" }: Props) {

	// Calculate overall grand total for the print header
	const grandTotal = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

	return (
		<Box sx={{ p: 3, bgcolor: "white", color: "black" }}>
			{/* Report Header */}
			<Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={4}>
				<Box>
					<Typography variant="h4" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
						{title}
					</Typography>
					<Typography variant="body2">
						Generated on: {formatDate(Date.now(), dateFormat)}
					</Typography>
				</Box>
				<Box textAlign="right">
					<Typography variant="body2" color="text.secondary">Total Transactions</Typography>
					<Typography variant="h6" fontWeight={700}>{sales.length}</Typography>
					<Typography variant="body2" color="text.secondary">Grand Total</Typography>
					<Typography variant="h5" fontWeight={700} color="primary.main">
						{formatNumber(grandTotal, { currency: true })}
					</Typography>
				</Box>
			</Stack>

			<Divider sx={{ mb: 4, borderBottomWidth: 2, borderColor: "black" }} />

			{/* Loop through each sale */}
			{sales.map((sale, index) => (
				<Box
					key={sale.id}
					sx={{
						mb: 6,
						breakInside: "avoid", // Prevents a single sale from splitting across pages
						pageBreakAfter: index === sales.length - 1 ? "auto" : "always" // Option: New page per sale
					}}
				>
					<Stack direction="row" justifyContent="space-between" mb={1}>
						<Typography variant="subtitle1" fontWeight={700}>
							Receipt: {sale.id}
						</Typography>
						{/* <Typography variant="subtitle1" fontWeight={700}>
							{formatDate(sale.createdAt.toMillis(), dateFormat)}
						</Typography> */}
					</Stack>

					<Typography variant="body2" mb={2}>
						Customer: <strong>{sale.customerName || "Walk-in Customer"}</strong>
					</Typography>

					<Table size="small" sx={{ border: "1px solid #e0e0e0" }}>
						<TableHead>
							<TableRow sx={{ bgcolor: "#f5f5f5" }}>
								<TableCell sx={{ fontWeight: 700, color: "black" }}>Item Description</TableCell>
								<TableCell align="center" sx={{ fontWeight: 700, color: "black" }}>Qty</TableCell>
								<TableCell align="right" sx={{ fontWeight: 700, color: "black" }}>Price</TableCell>
								<TableCell align="right" sx={{ fontWeight: 700, color: "black" }}>Amount</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{sale.carts.map((item, idx) => (
								<TableRow key={`${item.productId}-${idx}`}>
									<TableCell>{item.name}</TableCell>
									<TableCell align="center">{item.quantity}</TableCell>
									<TableCell align="right">{formatNumber(item.price, { currency: true })}</TableCell>
									<TableCell align="right" sx={{ fontWeight: 600 }}>
										{formatNumber(item.price * item.quantity, { currency: true })}
									</TableCell>
								</TableRow>
							))}
							{/* Individual Sale Summary Row */}
							<TableRow>
								<TableCell colSpan={3} align="right" sx={{ fontWeight: 700, border: 0 }}>
									Total for {sale.id}:
								</TableCell>
								<TableCell align="right" sx={{ fontWeight: 800, borderTop: "2px solid black" }}>
									{formatNumber(sale.totalAmount, { currency: true })}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					{index !== sales.length - 1 && (
						<Typography
							variant="caption"
							display="block"
							textAlign="center"
							sx={{ mt: 2, color: "#ccc", fontStyle: "italic" }}
						>
							End of Receipt {sale.id}
						</Typography>
					)}
				</Box>
			))}

			{/* Print Footer */}
			<Box mt={4} pt={2} sx={{ borderTop: "1px dashed #ccc", textAlign: "center" }}>
				<Typography variant="caption" color="text.secondary">
					*** End of Report ***
				</Typography>
			</Box>
		</Box>
	);
}

export function SalesPrintPage({sales, dateFormat, title}: Props) {
	const printRef = useRef<HTMLDivElement>(null);

	const handlePrint = useReactToPrint({
		contentRef: printRef,
		documentTitle: "Sales_Report",
		pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
	});

	return (
		<Box sx={{ p: 4 }}>
			<Stack direction={'row'} justifyContent={'end'}>
				<Button variant="contained" onClick={handlePrint} sx={{ mb: 3 }}>
					Print Sales Report
				</Button>
			</Stack>

			<Box ref={printRef}>
				<SalesPrintView
					sales={sales}
					dateFormat={dateFormat}
					title={title}
				/>
			</Box>
		</Box>
	);
}