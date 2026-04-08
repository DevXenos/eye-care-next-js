"use client"

import {
	AttachMoneyIcon,
	InventoryIcon,
	SupplierIcon,
	WarningIcon
} from "@/constants/icons";
import {
	Box,
	Chip,
	Divider,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography
} from "@mui/material";

import Grid from "@/components/ui/Grid";
import SalesChart from "./__components/SalesChart";
import formatDate from "@/utils/formatDate";
import { useAdmin } from "../AdminWrapper";
import { useMemo } from "react";
import { useProducts } from "@/stores/productsStore";
import { useProfile } from "@/stores/profileStore";
import { useSalesReport } from "@/stores/salesReportStore";
import { useStockHistory } from "@/stores/stockHistoryStore";
import { useSuppliers } from "@/stores/supplierStore";

export default function Outlet() {
	const currentAdmin = useAdmin();
	const {profile } = useProfile(currentAdmin.uid);
	const { products, getProductById } = useProducts();
	const sales = useSalesReport();
	const { suppliers } = useSuppliers();
	const histories = useStockHistory();

	/* =========================
		LOGIC: SUMMARY STATS
	========================= */
	const stats = useMemo(() => {
		const totalValue = products.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0);
		const totalItems = products.reduce((acc, p) => acc + p.stockQuantity, 0);
		const lowStockCount = products.filter(p => p.stockQuantity <= 20).length;

		return { totalValue, totalItems, lowStockCount };
	}, [products]);

	/* =========================
		LOGIC: RECENT MOVEMENTS
		(Filter: Manual/Initial noise)
	========================= */
	const recentMovements = useMemo(() => {
		return [...histories]
			.filter(log =>
				// Exclude manual setup records and initial imports
				log.source?.type !== 'manual' &&
				log.quantity !== 0
			)
			.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
			.slice(0, 7);
	}, [histories]);

	/* =========================
		LOGIC: TOP 5 SALES
	========================= */
	const mostProductSales5 = useMemo(() => {
		const map = new Map<string, number>();
		sales.forEach((sale) => {
			sale.carts.forEach((cart) => {
				const current = map.get(cart.productId) ?? 0;
				map.set(cart.productId, current + cart.quantity);
			});
		});

		return [...map.entries()]
			.map(([productId, total]) => {
				const product = products.find((p) => p.id === productId);
				return {
					productId: product?.id ?? "PROD-UNKNOWN",
					name: product?.name ?? "Deleted Product",
					price: product?.price ?? 0,
					quantity: total
				};
			})
			.sort((a, b) => b.quantity - a.quantity)
			.slice(0, 5);
	}, [sales, products]);

	return (
		<Grid spacing={2} p={2} container>

			{/* 1. TOP CARDS */}
			<Grid xs={12} md={4}>
				<Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
					<InventoryIcon color="primary" sx={{ fontSize: 40 }} />
					<Box>
						<Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Total Units</Typography>
						<Typography variant="h5" fontWeight={700}>{stats.totalItems.toLocaleString()}</Typography>
					</Box>
				</Paper>
			</Grid>

			<Grid xs={12} md={4}>
				<Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderLeft: '4px solid', borderColor: 'success.main' }}>
					<AttachMoneyIcon color="success" sx={{ fontSize: 40 }} />
					<Box>
						<Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Inventory Value</Typography>
						<Typography variant="h5" fontWeight={700}>${stats.totalValue.toLocaleString()}</Typography>
					</Box>
				</Paper>
			</Grid>

			<Grid xs={12} md={4}>
				<Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderLeft: '4px solid', borderColor: 'warning.main' }}>
					<SupplierIcon color="warning" sx={{ fontSize: 40 }} />
					<Box>
						<Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Suppliers</Typography>
						<Typography variant="h5" fontWeight={700}>{suppliers.filter(s => !s.archive).length}</Typography>
					</Box>
				</Paper>
			</Grid>

			{/* 2. LOW STOCK TABLE */}
			<Grid xs={12} lg={6}>
				<TableContainer component={Paper} sx={{ p: 2, height: '420px', display: 'flex', flexDirection: 'column' }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
						<Stack direction="row" alignItems="center" gap={1}>
							<WarningIcon color="error" />
							<Typography fontWeight={600} fontSize={18}>Low Stock Alerts</Typography>
						</Stack>
						<Chip label={`${stats.lowStockCount} Items`} color="error" size="small" variant="outlined" />
					</Stack>
					<Box sx={{ overflowY: 'auto', flex: 1 }}>
						<Table stickyHeader size="small">
							<TableBody>
								{products.filter(p => p.stockQuantity <= 20).length === 0 ? (
									<TableRow>
										<TableCell align="center" sx={{ border: 0, pt: 4 }}>
											<Typography variant="body2" color="text.secondary">All stock levels healthy</Typography>
										</TableCell>
									</TableRow>
								) : (
									products.filter(p => p.stockQuantity <= 20).map((product) => (
										<TableRow key={product.id} hover>
											<TableCell sx={{ border: 0 }}>{product.name}</TableCell>
											<TableCell align="right" sx={{ border: 0 }}>
												<Typography color="error.main" fontWeight={700}>
													{product.stockQuantity} <Typography component="span" variant="caption">qty</Typography>
												</Typography>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</Box>
				</TableContainer>
			</Grid>

			{/* 3. RECENT ACTIVITY */}
			<Grid xs={12} lg={6}>
				<Paper sx={{ p: 2, height: '420px', display: 'flex', flexDirection: 'column' }}>
					<Typography fontWeight={600} fontSize={18} mb={2}>Recent Activity</Typography>
					<Stack divider={<Divider />} gap={1} sx={{ overflowY: 'auto', flex: 1 }}>
						{recentMovements.length === 0 ? (
							<Typography variant="body2" color="text.secondary" align="center" mt={4}>
								No recent transactions to show
							</Typography>
						) : (
								recentMovements.map((log) => {
									const product = getProductById(log.productId);
									
								const isAdd = (log.quantity > 0);
								return (
									<Box key={log.id} sx={{ py: 1, px: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<Box>
											<Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: '250px' }}>
												{product?.name}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{formatDate(log.createdAt.toMillis(), profile.dateFormat)} • {isAdd ? 'Restock' : 'Stock Out'}
											</Typography>
										</Box>
										<Chip
											size="small"
											label={log.quantity}
											color={isAdd ? "success" : "error"}
											sx={{ fontWeight: 700, minWidth: 65 }}
										/>
									</Box>
								);
							})
						)}
					</Stack>
				</Paper>
			</Grid>

			{/* 4. TURNOVER CHART */}
			<Grid xs={12}>
				<Paper sx={{ p: 2 }}>
					<Typography fontWeight={600} fontSize={18} mb={1}>Inventory Turnover</Typography>
					<Typography variant="caption" color="text.secondary" display="block" mb={2}>
						Most sold products by volume
					</Typography>
					<SalesChart sales={mostProductSales5} />
				</Paper>
			</Grid>

		</Grid>
	);
}