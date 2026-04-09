"use client"

import {
	Autocomplete,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Tooltip,
} from "@mui/material";
import DialogProvider, { Dialog, DialogTrigger, useDialog } from "@/components/dialog";
import {
	ProductFormData,
	ProductType,
} from "@/types/ProductTypes";
import React, {
	startTransition,
	useActionState,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import editProductAction, { EditFormData } from "@/actions/product/edit-product-action";

import FormDataSerializer from "@/utils/FormDataSerializer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import addProductAction from "@/actions/product/add-product-action";
import { toast } from "sonner";
import useFieldState from "@/hooks/useFieldState";
import { useProducts } from "@/stores/productsStore";

export type Props = {
	edit?: boolean;
	product?: ProductType;
};

const initialForm: ProductFormData = {
	name: "",
	category: "",
	brand: "",
	price: 0,
	batchNumber: "",
	stockQuantity: 0,
	expiryDate: "",
	barcode: "",
};

function ProductForm({
	edit = false,
	product: product,
}: Props) {
	const { categories, brands } = useProducts();

	const [isLoading, startTransition] = useTransition();
	
	const { setOpen } = useDialog();
	const [data, setFieldData, reset, setData] = useFieldState<ProductFormData>(product || initialForm);

	const handleComboChange = (
		name: keyof ProductFormData,
		newValue: string | null
	) => {
		setData((prev) => ({
			...prev,
			[name]: newValue || "",
		}));
	};

	/* =========================
	   SUBMIT
	========================= */

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!edit) {
			startTransition(() => {
				toast.promise(
					addProductAction(data),
					{
						loading: "Adding Product",
						success: () => {
							reset();
							setOpen(false);
							return "Product Addedd Successfully"
						},
						error: (e) => (e as Error).message
					}
				)
			});

			return;
		}

		
		if (!edit || !product) return;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { createdAt, updatedAt, ...rest } = product;
		
		const payload: ProductFormData = {
			...rest,
			name: data.name,
			category: data.category,
			brand: data.brand,
			price: data.price,
			barcode: data.barcode
		}

		startTransition(() => {
			toast.promise(
				editProductAction(product.id, payload),
				{
					loading: "Updating Product",
					success: () => {
						setOpen(false);
						return "Product Updated Successfully";
					},
					error: (e) => (e as Error).message
				}
			)
		})
	};

	return (
		<Dialog fullWidth maxWidth="sm">
			<form onSubmit={handleSubmit}>
				<DialogTitle>Add Product</DialogTitle>
				
				<DialogContent>
					<Stack gap={3}>
						{/* Name */}
						<TextField
							label="Product Name"
							name="name"
							required
							fullWidth
							value={data.name}
							onChange={(e) => setFieldData("name", e.target.value)}
						/>

						{/* Category */}
						<Autocomplete
							freeSolo
							options={categories}
							value={data.category}
							onInputChange={(_, v) =>
								handleComboChange(
									"category",
									v
								)
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Category"
									required
								/>
							)}
						/>

						{/* Brand */}
						<Autocomplete
							freeSolo
							options={brands}
							value={data.brand}
							onInputChange={(_, v) =>
								handleComboChange(
									"brand",
									v
								)
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Brand"
									required
								/>
							)}
						/>

						{/* Price */}
						<TextField
							label="Price"
							name="price"
							type="number"
							required
							value={data.price}
							onChange={(e) => setFieldData("price", Number(e.target.value))}
						/>

						{/* Stock ONLY IN CREATE */}
						{!edit && (
							<TextField
								label="Quantity"
								name="stockQuantity"
								type="number"
								required
								value={data.stockQuantity}
								onChange={(e) => setFieldData("stockQuantity", Number(e.target.value))}
							/>
						)}

						{/* Barcode */}
						<TextField
							label="Barcode"
							name="barcode"
							fullWidth
							value={data.barcode}
							onChange={(e) => setFieldData("barcode", e.target.value)}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						type="button"
						onClick={() => {
							setOpen(false);
							if(!edit) reset()
						}}
					>
						Cancel
					</Button>

					<Button
						type="submit"
						variant="contained"
						loading={isLoading}
					>
						{edit
							? "Update"
							: "Save"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default function ProductFormDialog({ children, icon, ...props }: Props & { children?: React.ReactNode, icon: React.ReactNode }) {

	return (
		<DialogProvider>
			<DialogTrigger
				{...(!children ? {
					// Icon Button
					component: IconButton,
				} : {
					variant: "contained"
				})}
			>
				{children ? children : icon}
			</DialogTrigger>
			<ProductForm {...props} />
		</DialogProvider>
	)
}