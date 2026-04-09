"use client";

import {
	Box,
	Button,
	FormControlLabel,
	IconButton,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	Stack,
	SxProps,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Theme,
	Typography,
} from "@mui/material";
import { PurchaseProduct, PurchaseType } from "@/types/PurchaseTypes";
import addPurchaseAction, { AddPurchaseInput } from "@/actions/purchase/add-purchase-action";
import { startTransition, useActionState, useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import FormDataSerializer from "@/utils/FormDataSerializer";
import ProductCardList from "@/components/products/ProductCardsList";
import { ProductType } from "@/types/ProductTypes";
import { SupplierType } from "@/types/SupplierTypes";
import formatNumber from "@/utils/formatNumber";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSuppliers } from "@/stores/supplierStore";

const defId: SupplierType["id"] = "SUP-null";

export default function Outlet() {
	const [prev, action, isLoading] = useActionState(addPurchaseAction, null);

	const router = useRouter();
	const { suppliers } = useSuppliers();

	const [selectedSupplierId, setSelectedSupplierId] = useState<SupplierType["id"]>(defId);

	const [status, setStatus] = useState<PurchaseType["orders"]["status"]>("pending");

	const [carts, setCarts] = useState<PurchaseType["orders"]["products"]>([]);

	useEffect(() => {
		if (!prev) return;

		if (prev.success) toast.success("Purchase recorded");
		else toast.error(prev.error);
	}, [prev]);

	const handleStatusChange = (value: PurchaseType["orders"]["status"]) => {
		setStatus(value);

		if (value === "pending") {
			setCarts(prev =>
				prev.map(item => ({
					...item,
					recieved: 0
				}))
			);
		}

		if (value === "completed") {
			setCarts(prev =>
				prev.map(item => ({
					...item,
					recieved: item.quantity
				}))
			);
		}
	};

	const handleSelectedProduct = (product: ProductType) => {
		setCarts(prev => {
			const existing = prev.find(item => item.id === product.id);

			if (existing) {
				return prev.map(item =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}

			const prod: PurchaseProduct = {
				id: product.id,
				name: product.name,
				price: product.price,
				quantity: 1,
				received: 0,
			};

			return [...prev, prod];
		});
	};

	const handleEditQuantity = (value: number, index: number) => {
		setCarts(prev => {
			const copy = [...prev];
			copy[index] = { ...copy[index], quantity: value };
			return copy;
		});
	};

	const handleEditReceived = (value: number, index: number) => {
		setCarts(prev => {
			const copy = [...prev];

			const max = copy[index].quantity;

			copy[index] = {
				...copy[index],
				received: Math.min(value, max) // cannot exceed quantity
			};

			return copy;
		});
	};

	const handleDelete = (index: number) => {
		setCarts(prev => {
			const copy = [...prev];
			copy.splice(index, 1);
			return copy;
		});
	};

	const totalCost = carts.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);

	const onSubmit = () => {
		if (selectedSupplierId === defId)
			return toast.error("Please Select Supplier!");

		if (carts.length === 0)
			return toast.error("Please select at least 1 product!");

		const newCarts: AddPurchaseInput["orders"]["products"] =
			carts.map(cart => ({
				id: cart.id,
				name: cart.name,
				price: cart.price,
				quantity: cart.quantity,
				received: status === "completed" ? cart.received : 0
			}));

		const data = FormDataSerializer.send<AddPurchaseInput>({
			orders: {
				products: newCarts,
				status
			},
			supplierId: selectedSupplierId,
		});

		startTransition(async () => {
			await action(data);
			router.back();
		});
	};

	return (
		<Box sx={containerStyle}>

			<ProductCardList
				onProductSelectedAction={handleSelectedProduct}
				area="list"
			/>

			<Box
				sx={{
					gridArea: "transaction",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
					gap: 2,
				}}
			>

				<Select
					value={selectedSupplierId}
					displayEmpty
					onChange={(e) =>
						setSelectedSupplierId(
							e.target.value as SupplierType["id"]
						)
					}
				>
					<MenuItem value={defId} disabled>
						Select a supplier
					</MenuItem>

					{suppliers.map((supplier) => (
						<MenuItem key={supplier.id} value={supplier.id}>
							{supplier.name}
						</MenuItem>
					))}
				</Select>

				<Stack direction="row" spacing={2} alignItems="center">
					<Typography fontWeight={600}>Status:</Typography>

					<RadioGroup
						row
						value={status}
						onChange={(e) =>
							handleStatusChange(
								e.target.value as PurchaseType["orders"]["status"]
							)
						}
					>
						<FormControlLabel
							value="pending"
							control={<Radio />}
							label="Pending"
						/>
						<FormControlLabel
							value="completed"
							control={<Radio />}
							label="Completed"
						/>
					</RadioGroup>
				</Stack>

				<TableContainer sx={{ flex: 1 }}>
					<Table stickyHeader size="small">
						<TableHead>
							<TableRow>
								<TableCell>Product</TableCell>
								<TableCell align="right">Cost</TableCell>
								<TableCell align="right">Qty</TableCell>

								{status === "completed" && (
									<TableCell align="right">Received</TableCell>
								)}

								<TableCell align="right">Subtotal</TableCell>
								<TableCell width={50} />
							</TableRow>
						</TableHead>

						<TableBody>
							{carts.map((item, index) => (
								<TableRow key={item.id} hover>
									<TableCell>
										<Typography fontWeight={600}>
											{item.name}
										</Typography>
									</TableCell>

									<TableCell align="right">
										<TextField
											size="small"
											type="number"
											value={item.price}
											onChange={(e) =>
												setCarts(prev => {
													const copy = [...prev];
													copy[index] = {
														...copy[index],
														price: Number(e.target.value),
													};
													return copy;
												})
											}
											sx={{ width: 90 }}
										/>
									</TableCell>

									<TableCell align="right">
										<TextField
											size="small"
											type="number"
											value={item.quantity}
											onChange={(e) =>
												handleEditQuantity(
													Number(e.target.value),
													index
												)
											}
											sx={{ width: 70 }}
										/>
									</TableCell>

									{status === "completed" && (
										<TableCell align="right">
											<TextField
												size="small"
												type="number"
												value={item.received}
												onChange={(e) =>
													handleEditReceived(
														Number(e.target.value),
														index
													)
												}
												inputProps={{
													min: 0,
													max: item.quantity
												}}
												sx={{ width: 70 }}
											/>
										</TableCell>
									)}

									<TableCell align="right">
										{formatNumber(
											item.price * item.quantity,
											{ currency: true }
										)}
									</TableCell>

									<TableCell>
										<IconButton
											color="error"
											size="small"
											onClick={() => handleDelete(index)}
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</TableCell>
								</TableRow>
							))}

							{carts.length === 0 && (
								<TableRow>
									<TableCell colSpan={6} align="center">
										<Typography color="text.secondary">
											No items selected
										</Typography>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>

				<Stack p={2}>
					<Stack direction="row">
						<Typography fontWeight={600}>
							Total Cost
						</Typography>

						<Box flex={1} />

						<Typography
							fontWeight={700}
							color="primary.main"
						>
							{formatNumber(totalCost, { currency: true })}
						</Typography>
					</Stack>

					<Button
						onClick={onSubmit}
						variant="contained"
						loading={isLoading}
					>
						Purchase
					</Button>
				</Stack>
			</Box>
		</Box>
	);
}

const containerStyle: SxProps<Theme> = {
	display: "grid",
	height: { lg: "100%", md: "auto" },
	gridTemplateColumns: {
		xs: "1fr",
		lg: "1fr 600px",
	},
	gridTemplateRows: {
		xs: "auto 1fr",
		lg: "1fr",
	},
	gridTemplateAreas: {
		xs: `"transaction" "list"`,
		lg: `"list transaction"`,
	},
	gap: 2,
	p: 2,
};