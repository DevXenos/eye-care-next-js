"use client";

import Grid from "@/components/ui/Grid";
import { Box, Typography, Divider } from "@mui/material";

export type GridTableHeader<T> = {
	label: keyof T;
	displayLabel: string;
	size: number;
	textAlign: "start" | "end" | "center";
}

export type GridTableProps<T> = {
	headers: GridTableHeader<T>[];
	rows: T[];
	renderRowAction?: (row: T, column: GridTableHeader<T>, index: number) => React.ReactNode;
}

export default function GridTable<T>({ headers, rows, renderRowAction: renderRow }: GridTableProps<T>) {
	return (
		<Box sx={{ width: "100%" }}>
			{/* Header Row */}
			<Grid container spacing={1} sx={{ pb: 1 }}>
				{headers.map((header, index) => (
					<Grid key={index} xs={header.size}>
						<Typography textAlign={header.textAlign} variant="subtitle2" fontWeight="bold">
							{header.displayLabel}
						</Typography>
					</Grid>
				))}
			</Grid>

			<Divider />

			{/* Body Rows */}
			<Box sx={{ mt: 1 }}>
				{rows.map((row, rowIndex) => (
					<Grid container spacing={1} key={rowIndex} sx={{ py: 0.5, alignItems: "center" }}>
						{headers.map((header, colIndex) => {
							// Call the action to see if there is a custom override
							const customContent = renderRow ? renderRow(row, header, rowIndex) : null;

							return (
								<Grid key={colIndex} xs={header.size}>
									{/* If customContent exists, use it; otherwise, use default Typography */}
									{customContent ?? (
										<Typography textAlign={header.textAlign} variant="body2">
											{String(row[header.label] || "")}
										</Typography>
									)}
								</Grid>
							);
						})}
					</Grid>
				))}
			</Box>
		</Box>
	);
}