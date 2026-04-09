"use client"

import receivePurchaseAction, {
	ReceivePurchaseInput
} from "@/actions/purchase/receive-purchase-action";

import { PurchaseType } from "@/types/PurchaseTypes";
import FormDataSerializer from "@/utils/FormDataSerializer";

import {
	Stack,
	Typography,
	TextField,
	Button
} from "@mui/material";

import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	purchase: PurchaseType;
	onCloseAction: () => void;
};

export default function ReceiveForm({
	purchase,
	onCloseAction
}: Props) {

	const [prev, action, isLoading] =
		useActionState(receivePurchaseAction, null);
	
	useEffect(() => {
		if(!prev) return;

		if (prev.success) toast.success("Done");
		else toast.error(prev.error);
	}, [prev])

	// ✅ Local controlled state
	const [items, setItems] = useState(
		purchase.orders.products.map((product) => ({
			id: product.id,
			name: product.name,
			quantity: product.quantity,
			received: 0,
			price: 0
		}))
	);

	// ✅ Handle input changes
	const handleChange = (
		productId: string,
		field: "received" | "price",
		value: number
	) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === productId
					? { ...item, [field]: value }
					: item
			)
		);
	};

	// ✅ Submit
	const handleSubmit = () => {

		const formData =
			FormDataSerializer.send<ReceivePurchaseInput>({
				id: purchase.id,
				orders: {
					products: items,
					status: "completed"
				}
			});

		startTransition(async () => {
			await action(formData);
		});
	};

	return (
		<Stack spacing={2} mt={1}>

			{purchase.orders.products.map((product) => {

				const current = items.find(
					(i) => i.id === product.id
				);

				return (
					<Stack
						key={product.id}
						direction="row"
						spacing={2}
						alignItems="center"
					>

						{/* Product Info */}
						<Stack sx={{ flex: 1 }}>
							<Typography
								variant="body2"
								fontWeight={600}
							>
								{product.name}
							</Typography>

							<Typography
								variant="caption"
								color="text.secondary"
							>
								Order Quantity: {product.quantity}
							</Typography>
						</Stack>

						{/* Received */}
						<TextField
							size="small"
							type="number"
							label="Received"
							value={current?.received ?? 0}
							onChange={(e) =>
								handleChange(
									product.id,
									"received",
									Number(e.target.value)
								)
							}
							sx={{ width: 120 }}
							inputProps={{ min: 0 }}
						/>

						{/* Price */}
						<TextField
							size="small"
							type="number"
							label="Price"
							value={current?.price ?? 0}
							onChange={(e) =>
								handleChange(
									product.id,
									"price",
									Number(e.target.value)
								)
							}
							sx={{ width: 120 }}
							inputProps={{ min: 0 }}
						/>

					</Stack>
				);
			})}

			{/* Actions */}
			<Stack
				direction="row"
				justifyContent="flex-end"
				gap={2}
			>
				<Button onClick={onCloseAction}>
					Close
				</Button>

				<Button
					variant="contained"
					loading={isLoading}
					onClick={handleSubmit}
				>
					Receive
				</Button>
			</Stack>

		</Stack>
	);
}