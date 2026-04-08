"use client"

import { ArchiveIcon, EditIcon, UnarchiveIcon, ViewIcon } from "@/constants/icons";
import {
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Tooltip,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DateFormats } from "@/types/ProfileType";
import ProductForm from "./ProductForm";
import { ProductType } from "@/types/ProductTypes";
import ProductView from "./ProductView";
import archiveProduct from "@/actions/product/archive-product-action";
import formatDate from "@/utils/formatDate";
import { useDialog } from "@/providers/DialogProvider";
import useDialogConfirmation from "@/hooks/useDialogConfirmation";
import { useProducts } from "@/stores/productsStore";
import { useSalesReport } from "@/stores/salesReportStore";

type Props = {
	products: ProductType[];

	dateFormat: DateFormats;
};

type Order = 'asc' | 'desc';

export const ROW_HEIGHT = 60;

export const TableWithSkeleton = ({ products, dateFormat }: Props) => {

	const sales = useSalesReport();
	const { categories, brands } = useProducts();

	const { openDialog, removeDialog } = useDialog();
	const { openConfirmation, closeConfirmation } = useDialogConfirmation();
	const containerRef = useRef<HTMLDivElement>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setRowsCount] = useState(8);

	// Sorting State
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<keyof ProductType>('expiryDate'); // Default to Expiry

	useEffect(() => {
		const calculateRows = () => {
			if (containerRef.current) {
				const height = containerRef.current.clientHeight;
				setRowsCount(Math.floor((height - ROW_HEIGHT) / ROW_HEIGHT));
			}
		};
		calculateRows();
		window.addEventListener("resize", calculateRows);
		return () => window.removeEventListener("resize", calculateRows);
	}, []);

	const handleRequestSort = (property: keyof ProductType) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	// 1. ADVANCED SORTING LOGIC (Handles Dates and Nulls)
	const sortedProducts = useMemo(() => {
		return [...products].sort((a, b) => {
			const aValue = a[orderBy];
			const bValue = b[orderBy];

			// Special handling for dates (nulls go to the bottom)
			if (orderBy === 'expiryDate') {
				if (!aValue) return 1;
				if (!bValue) return -1;
				const dateA = new Date(aValue as string).getTime();
				const dateB = new Date(bValue as string).getTime();
				return order === 'asc' ? dateA - dateB : dateB - dateA;
			}

			// Standard Alpha/Numeric Sort
			if (bValue! < aValue!) return order === 'desc' ? -1 : 1;
			if (bValue! > aValue!) return order === 'desc' ? 1 : -1;
			return 0;
		});
	}, [products, order, orderBy]);

	// 2. EXPIRATION STATUS HELPER
	const getExpiryStyle = (dateString?: string) => {
		if (!dateString) return { color: 'text.secondary' };

		const expiry = new Date(dateString);
		const today = new Date();
		const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

		if (diffDays < 0) return { color: 'error.main', fontWeight: 'bold' }; // Expired
		if (diffDays <= 30) return { color: 'warning.main', fontWeight: 'bold' }; // Expiring soon (30 days)
		return { color: 'success.main' };
	};

	const handleArchiveRestore = useCallback(async ({ id, archive, name }: ProductType) => {

		const title = archive
			? "Restore Product"
			: "Archive Product";

		const message = archive
			? `Are you sure you want to restore "${name}"? It will become visible again in active lists.`
			: `Are you sure you want to archive "${name}"? It will be hidden from active lists but can be restored anytime.`;

		const btnText = archive ? "Restore" : "Archive";

		const confirmId = openConfirmation({
			title,
			message,
			buttons: (
				<>
					<Button onClick={() => closeConfirmation(confirmId)}>
						Cancel
					</Button>

					<Button
						color={archive ? "success" : "error"}
						onClick={async () => {
							await archiveProduct(id);
							closeConfirmation(confirmId);
						}}
					>
						{btnText}
					</Button>
				</>
			)
		});
	}, [closeConfirmation, openConfirmation]);

	const handleEditProduct = useCallback((product: ProductType) => {
		const id = openDialog(<ProductForm
			edit
			formData={product}
			categories={categories}
			brands={brands}
			onCancelAction={() => {
				removeDialog(id);
			}} />, { title: "Edit Product", showCloseButton: false })
	}, [openDialog, removeDialog, categories, brands])

	const handleViewProduct = useCallback((product: ProductType) => {
		const id = openDialog(<ProductView sales={sales} dateFormat={dateFormat} {...product} />, {
			onClose: () => removeDialog(id)
		})
	}, [dateFormat, openDialog, removeDialog, sales]);

	return (
		<>
			<TableContainer component={Paper} ref={containerRef}>
				<Table stickyHeader>
					<TableHead>
						<TableRow sx={{ height: ROW_HEIGHT }}>
							<TableCell sx={{ bgcolor: "background.paper", fontWeight: 700 }}>
								<TableSortLabel
									active={orderBy === 'name'}
									direction={orderBy === 'name' ? order : 'asc'}
									onClick={() => handleRequestSort('name')}
								> Name </TableSortLabel>
							</TableCell>

							<TableCell align="right" sx={{ bgcolor: "background.paper", fontWeight: 700 }}>
								<TableSortLabel
									active={orderBy === 'stockQuantity'}
									direction={orderBy === 'stockQuantity' ? order : 'asc'}
									onClick={() => handleRequestSort('stockQuantity')}
								> Stock </TableSortLabel>
							</TableCell>

							<TableCell align="right" sx={{ bgcolor: "background.paper", fontWeight: 700 }}>
								<TableSortLabel
									active={orderBy === 'price'}
									direction={orderBy === 'price' ? order : 'asc'}
									onClick={() => handleRequestSort('price')}
								> Price </TableSortLabel>
							</TableCell>

							{/* 3. EXPIRATION SORT HEADER */}
							<TableCell sx={{ bgcolor: "background.paper", fontWeight: 700 }}>
								<TableSortLabel
									active={orderBy === 'expiryDate'}
									direction={orderBy === 'expiryDate' ? order : 'asc'}
									onClick={() => handleRequestSort('expiryDate')}
								>
									Expiration
								</TableSortLabel>
							</TableCell>

							<TableCell align="right" sx={{ bgcolor: "background.paper", fontWeight: 700 }}>Action</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{sortedProducts.map((product) => {
							const statusStyle = getExpiryStyle(product.expiryDate);
							return (
								<TableRow key={product.id} hover sx={{ height: ROW_HEIGHT }}>
									<TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
									<TableCell align="right">{product.stockQuantity}</TableCell>
									<TableCell align="right">₱{product.price.toLocaleString()}</TableCell>

									{/* 4. DYNAMIC EXPIRATION CELL */}
									<TableCell>
										<Typography variant="body2" sx={statusStyle}>
											{formatDate(product.expiryDate, dateFormat) || "No Expiry"}
										</Typography>
									</TableCell>

									<TableCell align="right">
										<Tooltip title="Edit" arrow><IconButton
											onClick={() => handleEditProduct(product)}
											size="small"><EditIcon /></IconButton></Tooltip>

										<Tooltip title={product.archive ? "Restore" : "Archive"} arrow>

											<IconButton
												size="small"
												color={product.archive ? "success" : "error"}
												onClick={() => handleArchiveRestore(product)}
											>
												{product.archive ? (<UnarchiveIcon />) : (<ArchiveIcon />)}
											</IconButton>
										</Tooltip>

										<Tooltip title="View" arrow><IconButton onClick={() => handleViewProduct(product)} size="small" color="success"><ViewIcon /></IconButton></Tooltip>
									</TableCell>
								</TableRow>
							);
						})}
						{/* Skeletons go here if isLoading is true (skipped for brevity) */}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};