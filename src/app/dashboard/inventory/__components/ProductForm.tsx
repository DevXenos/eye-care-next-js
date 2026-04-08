"use client"

import {
	Autocomplete,
	Button,
	InputAdornment,
	Stack,
	TextField,
	Tooltip,
} from "@mui/material";
import editProductAction, { EditFormData } from "@/actions/product/edit-product-action";
import {
	startTransition,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";

import FormDataSerializer from "@/utils/FormDataSerializer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
	ProductFormData,
} from "@/types/ProductTypes";
import addProductAction from "@/actions/product/add-product-action";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FieldInfo = ({ text }: { text: string }) => (
	<InputAdornment position="end">
		<Tooltip title={text} arrow>
			<InfoOutlinedIcon
				sx={{
					fontSize: 18,
					cursor: "help",
					opacity: 0.8,
				}}
			/>
		</Tooltip>
	</InputAdornment>
);

export type Props = {
	categories: string[];
	brands: string[];
	onCancelAction: () => void;
	edit?: boolean;
	formData?: ProductFormData;
};

const initialForm: ProductFormData = {
	id: "PROD-",
	name: "",
	category: "",
	brand: "",
	price: 0,
	batchNumber: "",
	stockQuantity: 0,
	expiryDate: "",
	barcode: "",
};

export default function ProductForm({
	categories,
	brands,
	onCancelAction,
	edit = false,
	formData: initialData,
}: Props) {
	/* =========================
	   ACTION SELECTION
	========================= */

	const [prev, action, isLoading] =
		useActionState(
			edit
				? editProductAction
				: addProductAction,
			null
		);

	/* =========================
	   STATE
	========================= */

	const [formData, setFormData] =
		useState<ProductFormData>(
			initialData || initialForm
		);

	const submissionIntent =
		useRef<"SAVE" | "SAVE_AND_ANOTHER">(
			"SAVE"
		);

	/* =========================
	   RESULT HANDLER
	========================= */

	useEffect(() => {
		if (!prev) return;

		if (prev.success) {
			toast.success(
				edit
					? "Product updated!"
					: "Product added!"
			);

			if (
				submissionIntent.current ===
				"SAVE_AND_ANOTHER"
			) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setFormData(initialForm);
			} else {
				onCancelAction();
			}
		} else {
			toast.error(prev.error);
		}
	}, [edit, onCancelAction, prev]);

	/* =========================
	   INPUT HANDLERS
	========================= */

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]:
				name === "price"
					? value === ""
						? 0
						: Number(value)
					: value,
		}));
	};

	const handleComboChange = (
		name: keyof ProductFormData,
		newValue: string | null
	) => {
		setFormData((prev) => ({
			...prev,
			[name]: newValue || "",
		}));
	};

	/* =========================
	   SUBMIT
	========================= */

	const handleSubmit = (
		e: React.FormEvent
	) => {
		e.preventDefault();

		// 🔥 CREATE MODE
		if (!edit) {
			const form =
				FormDataSerializer.send(
					formData
				);

			startTransition(() =>
				action(form)
			);
			return;
		}

		// 🔥 EDIT MODE (REMOVE STOCK)
		const {
			...safePayload
		} = formData;

		const payload: EditFormData =
		{
			...safePayload,
			id: formData.id,
		};

		const form =
			FormDataSerializer.send(
				payload
			);

		startTransition(() =>
			action(form)
		);
	};

	/* =========================
	   UI
	========================= */

	return (
		<Stack
			component="form"
			onSubmit={handleSubmit}
			gap={3}
		>
			{/* Name */}
			<TextField
				label="Product Name"
				name="name"
				required
				fullWidth
				value={formData.name}
				onChange={handleInputChange}
			/>

			{/* Category */}
			<Autocomplete
				freeSolo
				options={categories}
				value={formData.category}
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
				value={formData.brand}
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
				value={formData.price}
				onChange={handleInputChange}
			/>

			{/* Stock ONLY IN CREATE */}
			{!edit && (
				<TextField
					label="Quantity"
					name="stockQuantity"
					type="number"
					required
					value={
						formData.stockQuantity
					}
					onChange={
						handleInputChange
					}
				/>
			)}

			{/* Barcode */}
			<TextField
				label="Barcode"
				name="barcode"
				fullWidth
				value={formData.barcode}
				onChange={handleInputChange}
			/>

			{/* Actions */}
			<Stack
				direction="row"
				justifyContent="end"
				gap={2}
			>
				<Button
					type="button"
					onClick={
						onCancelAction
					}
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
			</Stack>
		</Stack>
	);
}