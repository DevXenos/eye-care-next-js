"use client";

import {
	Button,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	TextField,
	Typography,
} from "@mui/material";
import { SearchBar, useSearchBar } from "@/components/ui/SearchBar";
import { useCallback, useMemo, useState } from "react";

import ActionOnTop from "@/components/ui/ActionOnTop";
import LZString from "lz-string";
import { ROW_HEIGHT } from "../inventory/__components/InventoryTable";
import SalesReportView from "./__components/SalesView";
import { SalesType } from "@/types/SalesType";
import { ViewIcon } from "@/constants/icons";
import formatDate from "@/utils/formatDate";
import formatNumber from "@/utils/formatNumber";
import jwt from "jsonwebtoken";
import { useAdmin } from "../AdminWrapper";
import { useDialog } from "@/providers/DialogProvider";
import { useProfile } from "@/stores/profileStore";
import { useRouter } from "next/navigation";
import { useSalesReport } from "@/stores/salesReportStore";

type FilterOption = "today" | "thisWeek" | "thisMonth" | "thisYear" | "custom";
type SortField = "customerName" | "totalAmount" | "items" | "createdAt";
type SortDirection = "asc" | "desc";

export default function OutletSalesReport() {
	const currentAdmin = useAdmin();
	const { profile } = useProfile(currentAdmin.uid);
	const sales = useSalesReport();

	const router = useRouter();

	const {openDialog} = useDialog()

	// Search Bar Hook
	const [query, onChangeQuery] = useSearchBar();

	// Filter States
	const [filter, setFilter] = useState<FilterOption>("today");
	const [customFrom, setCustomFrom] = useState<string>("");
	const [customTo, setCustomTo] = useState<string>("");

	// Sort States
	const [sortBy, setSortBy] = useState<SortField>("createdAt");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

	/* =========================
		LOGIC: SEARCH & FILTER
	========================= */
	const filteredSales = useMemo(() => {
		const now = new Date();
		const searchLower = query.toLowerCase().trim();

		return sales.filter((sale) => {
			// 1. Check Search Query (matches ID or Customer Name)
			const matchesSearch =
				sale.customerName.toLowerCase().includes(searchLower) ||
				sale.id.toLowerCase().includes(searchLower);

			if (!matchesSearch) return false;

			// 2. Check Date Range
			const saleDate = sale.createdAt.toDate();
			switch (filter) {
				case "today":
					return saleDate.toDateString() === now.toDateString();
				case "thisWeek": {
					const startOfWeek = new Date(now);
					startOfWeek.setDate(now.getDate() - now.getDay());
					startOfWeek.setHours(0, 0, 0, 0);
					return saleDate >= startOfWeek;
				}
				case "thisMonth":
					return (
						saleDate.getMonth() === now.getMonth() &&
						saleDate.getFullYear() === now.getFullYear()
					);
				case "thisYear":
					return saleDate.getFullYear() === now.getFullYear();
				case "custom":
					if (!customFrom || !customTo) return true;
					const from = new Date(customFrom);
					const to = new Date(customTo);
					to.setHours(23, 59, 59, 999);
					return saleDate >= from && saleDate <= to;
				default:
					return true;
			}
		});
	}, [sales, filter, customFrom, customTo, query]);

	/* =========================
		LOGIC: SORTING
	========================= */
	const sortedSales = useMemo(() => {
		return [...filteredSales].sort((a, b) => {
			let aValue: any, bValue: any;

			switch (sortBy) {
				case "customerName":
					aValue = a.customerName.toLowerCase();
					bValue = b.customerName.toLowerCase();
					break;
				case "totalAmount":
					aValue = a.totalAmount;
					bValue = b.totalAmount;
					break;
				case "items":
					aValue = a.carts.length;
					bValue = b.carts.length;
					break;
				case "createdAt":
					aValue = a.createdAt.toMillis();
					bValue = b.createdAt.toMillis();
					break;
				default:
					return 0;
			}

			if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
			if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredSales, sortBy, sortDirection]);

	const handleSort = (field: SortField) => {
		if (sortBy === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setSortDirection("asc");
		}
	};

	const handleView = useCallback((sale: SalesType) => {
		openDialog(
			<SalesReportView
				dateFormat={profile.dateFormat}
				{...sale}
			/>,
			{title: "Sales Report View"}
		)
	}, [openDialog, profile.dateFormat])

	return (
		<Stack p={2} gap={2}>
			<ActionOnTop>
				<SearchBar fullWidth value={query} onChange={onChangeQuery} />

				<Select
					size="small"
					value={filter}
					onChange={(e) => setFilter(e.target.value as FilterOption)}
					sx={{ minWidth: 140 }}
				>
					<MenuItem value="today">Today</MenuItem>
					<MenuItem value="thisWeek">This Week</MenuItem>
					<MenuItem value="thisMonth">This Month</MenuItem>
					<MenuItem value="thisYear">This Year</MenuItem>
					<MenuItem value="custom">Custom</MenuItem>
				</Select>

				{filter === "custom" && (
					<Stack direction="row" gap={1} alignItems="center">
						<TextField
							size="small"
							label="From"
							type="date"
							value={customFrom}
							onChange={(e) => setCustomFrom(e.target.value)}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							size="small"
							label="To"
							type="date"
							value={customTo}
							onChange={(e) => setCustomTo(e.target.value)}
							InputLabelProps={{ shrink: true }}
						/>
					</Stack>
				)}

				<Button
					onClick={() => {
						try {
							sessionStorage.setItem('sales', JSON.stringify(sortedSales));
							router.push("/dashboard/sales-report/print")
						} catch (e) {
							console.error(e);
						}
					}}
				>
					Print
				</Button>
			</ActionOnTop>

			<TableContainer component={Paper} variant="outlined">
				<Table stickyHeader size="small">
					<TableHead>
						<TableRow sx={{height: ROW_HEIGHT}}>
							<TableCell>
								<TableSortLabel
									active={sortBy === "customerName"}
									direction={sortDirection}
									onClick={() => handleSort("customerName")}
								>
									Customer Name
								</TableSortLabel>
							</TableCell>
							<TableCell align="right">
								<TableSortLabel
									active={sortBy === "totalAmount"}
									direction={sortDirection}
									onClick={() => handleSort("totalAmount")}
								>
									Total Amount
								</TableSortLabel>
							</TableCell>
							<TableCell align="center">
								<TableSortLabel
									active={sortBy === "items"}
									direction={sortDirection}
									onClick={() => handleSort("items")}
								>
									Items
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={sortBy === "createdAt"}
									direction={sortDirection}
									onClick={() => handleSort("createdAt")}
								>
									Date
								</TableSortLabel>
							</TableCell>
							<TableCell align="right">
								<TableSortLabel>
									Action
								</TableSortLabel>
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{sortedSales.map((sale) => (
								<TableRow key={sale.id} hover sx={{height: ROW_HEIGHT}}>
									<TableCell sx={{ fontWeight: 500 }}>
										{sale.customerName || "Walk-in Customer"}
									</TableCell>
									<TableCell align="right">
										{formatNumber(sale.totalAmount, { currency: true })}
									</TableCell>
									<TableCell align="center">{sale.carts.length}</TableCell>
									<TableCell color="text.secondary">
										{formatDate(sale.createdAt.toMillis(), profile.dateFormat)}
									</TableCell>
									<TableCell align="right">
										<IconButton onClick={() => handleView(sale)}>
											<ViewIcon/>
										</IconButton>
									</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
}