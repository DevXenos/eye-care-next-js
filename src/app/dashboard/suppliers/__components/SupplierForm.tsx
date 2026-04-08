"use client"

import { SupplierType } from "@/types/SupplierTypes";
import { Stack, TextField, IconButton, Button } from "@mui/material";
import { startTransition, useActionState, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "sonner";
import addSupplierAction, { SupplierFormData } from "@/actions/supplier/add-supplier-action";
import FormDataSerializer from "@/utils/FormDataSerializer";
import editSupplierAction, { EditSupplierFormData } from "@/actions/supplier/edit-supplier-action";

export type SupplierFormProps = {
	suppliers: (Omit<SupplierType, 'createdAt' | 'updatedAt'>)[];
	onCloseAction: () => void;
	edit?: boolean;
	supplier?: SupplierType;
}

export default function SupplierForm({ suppliers, onCloseAction, edit, supplier }: SupplierFormProps) {
	// Select the correct action based on edit mode
	const currentAction = edit ? editSupplierAction : addSupplierAction;
	const [prev, action, isLoading] = useActionState(currentAction, null);

	// Initialize state with supplier data if in edit mode
	const [name, setName] = useState(supplier?.name ?? "");
	const [address, setAddress] = useState(supplier?.address ?? "");
	const [website, setWebsite] = useState(supplier?.website ?? "");
	const [contacts, setContacts] = useState<string[]>(supplier?.contacts ?? [""]);

	useEffect(() => {
		if (!prev) return;
		if (prev.success) {
			toast.success(edit ? "Updated successfully" : "Added successfully");
			onCloseAction();
		}
		else toast.error(prev.error);
	}, [prev, edit, onCloseAction]);

	const handleContactChange = (idx: number, value: string) => {
		const newContacts = [...contacts];
		newContacts[idx] = value;
		setContacts(newContacts);
	};

	const addContactField = () => setContacts([...contacts, ""]);

	const removeContactField = (idx: number) => {
		if (contacts.length === 1) return toast.error("At least 1 contact required");
		setContacts(contacts.filter((_, i) => i !== idx));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Check for duplicates (excluding the current supplier if editing)
		const isExists = suppliers.find(
			(s) =>
				s.name.trim().toLocaleUpperCase() === name.trim().toLocaleUpperCase() &&
				s.id !== supplier?.id
		);

		if (isExists) return toast.error("This supplier name is already registered.");

		try {
			// Prepare data using the correct interface based on mode
			const data: any = {
				name: name.trim(),
				address: address.trim(),
				contacts: contacts.filter(c => c.trim() !== ""),
				website: website.trim(),
			};

			// Add ID if we are editing
			if (edit && supplier?.id) {
				data.id = supplier.id;
			}

			const formData = FormDataSerializer.send<SupplierFormData | EditSupplierFormData>(data);

			startTransition(() => action(formData));
		} catch (err) {
			toast.error("Something went wrong");
			console.error(err);
		}
	};

	return (
		<Stack
			p={2}
			gap={2}
			component="form"
			onSubmit={handleSubmit}
			minWidth={400}
		>
			<TextField
				label="Name"
				value={name}
				onChange={e => setName(e.target.value)}
				required
				fullWidth
			/>

			<TextField
				label="Address"
				value={address}
				onChange={e => setAddress(e.target.value)}
				required
				fullWidth
			/>

			{contacts.map((contact, idx) => (
				<Stack key={idx} direction="row" gap={1} alignItems="center">
					<TextField
						label={`Contact ${idx + 1}`}
						value={contact}
						onChange={e => handleContactChange(idx, e.target.value)}
						fullWidth
						slotProps={{
							htmlInput: {
								maxLength: 25,
							}
						}}
						required
					/>
					<IconButton
						onClick={() => removeContactField(idx)}
						disabled={contacts.length === 1}
						size="small"
						color="error"
					>
						<RemoveIcon />
					</IconButton>
				</Stack>
			))}

			<Button
				startIcon={<AddIcon />}
				type="button"
				onClick={addContactField}
				sx={{ alignSelf: 'flex-start' }}
			>
				Add Contact
			</Button>

			<TextField
				label="Website Url"
				value={website}
				onChange={e => setWebsite(e.target.value)}
				fullWidth
			/>

			<Stack direction="row" gap={2} justifyContent="end">
				<Button onClick={onCloseAction}>Close</Button>

				<Button
					type="submit"
					variant="contained"
					disabled={isLoading}
					sx={{ mt: 1 }}
				>
					{isLoading ? "Saving..." : (edit ? "Update Supplier" : "Submit")}
				</Button>
			</Stack>

		</Stack>
	);
}