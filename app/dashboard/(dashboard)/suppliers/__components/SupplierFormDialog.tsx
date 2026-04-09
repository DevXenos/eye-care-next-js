"use client";

import {
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
} from "@mui/material";
import DialogProvider, { Dialog, DialogTrigger, useDialog } from "@/components/dialog";
import React, { useEffect, useState, useTransition } from "react";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { SupplierType } from "@/types/SupplierTypes";
import addSupplierAction from "@/actions/supplier/add-supplier-action";
import editSupplierAction from "@/actions/supplier/edit-supplier-action";
import { toast } from "sonner";

export type SupplierFormProps = {
	title: string;
	suppliers: (Omit<SupplierType, 'createdAt' | 'updatedAt'>)[];
	edit?: boolean;
	supplier?: SupplierType;
}

type Data = Pick<SupplierType, "name" | "address" | "contacts" | "website"> & Partial<Pick<SupplierType, "id">>;

const def: Data = {
	name: "",
	address: "",
	website: "",
	contacts: ['']
}

function SupplierForm({ title, suppliers, edit, supplier }: SupplierFormProps) {
	const [isLoading, startTransition] = useTransition();

	const { setOpen } = useDialog();
	const [data, setData] = useState<Data>(def);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setData({
			name: supplier?.name ?? "",
			address: supplier?.address ?? "",
			website: supplier?.website ?? "",
			contacts: supplier?.contacts ?? [""],
		});
	}, [supplier]);

	const handleFinish = () => {
		setData(def);
		setOpen(false);
	}

	const handleFieldChange = (key: keyof Data, value: Data[keyof Data]) => {
		setData((prev) => ({
			...prev,
			[key]: value
		}))
	}

	const handleContactChange = (idx: number, value: string) => {
		const newContacts = [...data.contacts];
		newContacts[idx] = value;
		setData((prev) => ({
			...prev,
			contacts: newContacts,
		}))
	};

	const addContactField = () => setData((prev) => ({
		...prev,
		contacts: [...prev.contacts, ""]
	}));

	const removeContactField = (idx: number) => {
		if (data.contacts.length === 1) return toast.error("At least 1 contact required");
		setData((prev) => ({
			...prev,
			contacts: data.contacts.filter((_, i) => i !== idx)
		}))
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Check for duplicates (excluding the current supplier if editing)
		const isExists = suppliers.find(
			(s) =>
				s.name.trim().toLocaleUpperCase() === data.name.trim().toLocaleUpperCase() &&
				s.id !== supplier?.id
		);

		if (isExists) return toast.error("This supplier name is already registered.");

		try {
			if (edit && supplier) {
				startTransition(() => {
					toast.promise(
						editSupplierAction({
							...data,
							id: supplier.id
						}),
						{
							loading: `Updating Supplier`,
							success: () => {
								setOpen(false);
								return `Supplier Updated successfully`;
							},
							error: (e) => (e as Error).message,
						}
					)
				});
			} else {
				startTransition(() => {
					toast.promise(
						addSupplierAction({
							...data,
						}),
						{
							loading: `Adding Supplier`,
							success: () => {
								handleFinish();
								return `Supplier Addedd successfully`
							},
							error: (e) => (e as Error).message,
						}
					)
				});
			}

		} catch (err) {
			toast.error("Something went wrong");
			console.error(err);
		}
	};

	return (
		<Dialog maxWidth="sm" fullWidth>
			<form onSubmit={handleSubmit}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<Stack
						p={2}
						gap={2}
					>
						<TextField
							label="Name"
							value={data.name}
							onChange={e => handleFieldChange("name", e.target.value)}
							required
							fullWidth
						/>

						<TextField
							label="Address"
							value={data.address}
							onChange={e => handleFieldChange("address", e.target.value)}
							required
							fullWidth
						/>

						{data.contacts.map((contact, idx) => (
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
									disabled={data.contacts.length === 1}
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
							value={data.website}
							onChange={e => handleFieldChange("website", e.target.value)}
							fullWidth
						/>

					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Close</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={isLoading}
						sx={{ mt: 1 }}
					>
						{isLoading ? "Saving..." : (edit ? "Update Supplier" : "Submit")}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default function SupplierFormDialog({
	icon,
	children,
	...props
}: SupplierFormProps & { children?: React.ReactNode; icon: React.ReactNode }) {
	return (
		<DialogProvider>
			<DialogTrigger
				component={!children ? IconButton : Button}
				{...(children ? { variant: "contained", startIcon: icon } : {})}
			>
				{children ? children : icon}
			</DialogTrigger>
			<SupplierForm {...props} />
		</DialogProvider>
	);
}