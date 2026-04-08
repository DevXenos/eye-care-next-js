"use client";

import { AddIcon, ViewIcon } from "@/constants/icons";
import { ArchiveIcon, EditIcon, UnarchiveIcon } from "@/constants/icons";
import {
	Button,
	FormControlLabel,
	IconButton,
	Paper,
	Stack,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Tooltip,
} from "@mui/material";
import { SearchBar, useSearchBar } from "@/components/ui/SearchBar";
import editSupplierAction, { EditSupplierFormData } from "@/actions/supplier/edit-supplier-action";
import { useCallback, useMemo, useState } from "react";

import ActionOnTop from "@/components/ui/ActionOnTop";
import FormDataSerializer from "@/utils/FormDataSerializer";
import SupplierForm from "./__components/SupplierForm";
import { SupplierType } from "@/types/SupplierTypes";
import SupplierView from "./__components/SupplierView";
import formatDate from "@/utils/formatDate";
import { useAdmin } from "../AdminWrapper";
import { useDialog } from "@/providers/DialogProvider";
import useDialogConfirmation from "@/hooks/useDialogConfirmation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProfile } from "@/stores/profileStore";
import { useSuppliers } from "@/stores/supplierStore";

export default function OutletSuppliers() {
	const currentAdmin = useAdmin()
	const { suppliers } = useSuppliers();
	const { profile } = useProfile(currentAdmin.uid);

	const { openConfirmation, closeConfirmation } = useDialogConfirmation();
	const { openDialog, closeDialog } = useDialog();

	const [query, onChangeQuery] = useSearchBar();
	const [showArchive, setShowArchive] = useLocalStorage<boolean>('supplier-archive', false);

	/* =========================
		ADD SUPPLIER
	========================= */

	const onClickAddNewSupplier = useCallback(() => {
		const id = openDialog(
			<SupplierForm
				suppliers={suppliers}
				onCloseAction={() => closeDialog(id)}
			/>,
			{ onClose: () => closeDialog(id) }
		);
	}, [openDialog, closeDialog, suppliers]);

	/* =========================
		SORT STATE
	========================= */

	const [sortConfig, setSortConfig] = useState<{
		key: keyof SupplierType;
		direction: "asc" | "desc";
	}>({
		key: "createdAt",
		direction: "desc",
	});

	/* =========================
		SEARCH & ARCHIVE FILTER
	========================= */

	const filteredSuppliers = useMemo(() => {
		// First: Filter by archive status
		const results = suppliers.filter((s) =>
			showArchive ? s.archive === true : !s.archive
		);

		// Second: Filter by search query
		if (!query) return results;

		const q = query.toLowerCase();

		return results.filter((supplier) =>
			supplier.name.toLowerCase().includes(q) ||
			supplier.address.toLowerCase().includes(q) ||
			supplier.contacts.some((c) =>
				c.toLowerCase().includes(q)
			) ||
			(supplier.website ?? "")
				.toLowerCase()
				.includes(q)
		);
	}, [suppliers, query, showArchive]);

	/* =========================
		SORTING
	========================= */

	const sortedSuppliers = useMemo(() => {
		return filteredSuppliers
			.slice()
			.sort((a, b) => {
				let aValue: string | number;
				let bValue: string | number;

				switch (sortConfig.key) {
					case "name":
						aValue = a.name.toLowerCase();
						bValue = b.name.toLowerCase();
						break;

					case "contacts":
						aValue = a.contacts
							.join(", ")
							.toLowerCase();
						bValue = b.contacts
							.join(", ")
							.toLowerCase();
						break;

					case "website":
						aValue = (
							a.website ?? ""
						).toLowerCase();
						bValue = (
							b.website ?? ""
						).toLowerCase();
						break;

					case "createdAt":
						aValue =
							a.createdAt.toMillis();
						bValue =
							b.createdAt.toMillis();
						break;

					default:
						return 0;
				}

				if (aValue < bValue)
					return sortConfig.direction === "asc" ? -1 : 1;

				if (aValue > bValue)
					return sortConfig.direction === "asc" ? 1 : -1;

				return 0;
			});
	}, [filteredSuppliers, sortConfig]);

	/* =========================
		CONTACT SUMMARY
	========================= */

	const summarizeContacts = (
		contacts: SupplierType["contacts"]
	) => {
		if (!contacts || contacts.length === 0)
			return "-";

		if (contacts.length === 1)
			return contacts[0];

		return `${contacts[0]} +${contacts.length - 1} more`;
	};

	/* =========================
		SORT HANDLER
	========================= */

	const handleSort = (key: keyof SupplierType) => {
		setSortConfig((prev) => ({
			key,
			direction:
				prev.key === key &&
					prev.direction === "asc"
					? "desc"
					: "asc",
		}));
	};

	/* =========================
		VIEW SUPPLIER
	========================= */

	const handleView = useCallback(
		(supplier: SupplierType) => {
			const id = openDialog(
				<SupplierView
					dateFormat={profile.dateFormat}
					{...supplier}
				/>,
				{
					onClose: () =>
						closeDialog(id),
				}
			);
		},
		[closeDialog, openDialog, profile.dateFormat]
	);

	/* =========================
		ARCHIVE / RESTORE
	========================= */

	const handleArchiveRestore = useCallback(
		(supplier: SupplierType) => {
			const isArchiving = !supplier.archive;

			const formData = FormDataSerializer.send<EditSupplierFormData>({
				id: supplier.id,
				archive: isArchiving,
			});

			const id = openConfirmation({
				title: isArchiving ? "Archive Supplier" : "Restore Supplier",
				message: isArchiving
					? "Are you sure you want to archive this supplier? They will be hidden from active lists."
					: "Do you want to restore this supplier to the active list?",
				buttons: (
					<>
						<Button onClick={() => closeConfirmation(id)}>
							Cancel
						</Button>

						<Button
							color={isArchiving ? "error" : "success"}
							variant="contained"
							onClick={() => {
								closeConfirmation(id);
								editSupplierAction(null, formData);
							}}
						>
							{isArchiving ? "Archive" : "Restore"}
						</Button>
					</>
				),
			});
		},
		[openConfirmation, closeConfirmation]
	);

	const handleEdit = useCallback((supplier: SupplierType) => {
		const id = openDialog(
			<SupplierForm
				edit
				supplier={supplier}
				suppliers={suppliers}
				onCloseAction={() => closeDialog(id)}
			/>,
			{showCloseButton: false, title: "Edit Supplier"}
		)
	}, [closeDialog, openDialog, suppliers])

	return (
		<Stack gap={2} p={2} height="100%">
			<ActionOnTop>
				<FormControlLabel
					control={
						<Switch
							checked={showArchive}
							onChange={(e) => setShowArchive(e.target.checked)}
						/>
					}
					label={showArchive ? "Showing Archived" : "Showing Active"}
				/>

				<SearchBar
					sx={{ flex: 1 }}
					value={query}
					onChange={onChangeQuery}
				/>

				<Button
					variant="outlined"
					onClick={onClickAddNewSupplier}
					startIcon={<AddIcon />}
				>
					Add Supplier
				</Button>
			</ActionOnTop>

			<TableContainer component={Paper}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>
								<TableSortLabel
									active={sortConfig.key === "name"}
									direction={sortConfig.key === "name" ? sortConfig.direction : "asc"}
									onClick={() => handleSort("name")}
								>
									Name
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortConfig.key === "contacts"}
									direction={sortConfig.key === "contacts" ? sortConfig.direction : "asc"}
									onClick={() => handleSort("contacts")}
								>
									Contacts
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortConfig.key === "website"}
									direction={sortConfig.key === "website" ? sortConfig.direction : "asc"}
									onClick={() => handleSort("website")}
								>
									Website
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortConfig.key === "createdAt"}
									direction={sortConfig.key === "createdAt" ? sortConfig.direction : "asc"}
									onClick={() => handleSort("createdAt")}
								>
									Created At
								</TableSortLabel>
							</TableCell>

							<TableCell align="right">Action</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{sortedSuppliers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} align="center">
									No {showArchive ? "archived" : "active"} suppliers found
								</TableCell>
							</TableRow>
						) : (
							sortedSuppliers.map((supplier) => (
								<TableRow key={supplier.id} hover>
									<TableCell>{supplier.name}</TableCell>
									<TableCell>
										<Tooltip title={supplier.contacts.join(", ")}>
											<span>{summarizeContacts(supplier.contacts)}</span>
										</Tooltip>
									</TableCell>
									<TableCell>
										{supplier.website ? (
											<a href={supplier.website} target="_blank" rel="noopener noreferrer">
												{supplier.website}
											</a>
										) : "-"}
									</TableCell>
									<TableCell>
										{formatDate(supplier.createdAt.toMillis(), profile.dateFormat)}
									</TableCell>
									<TableCell align="right">
										<Stack direction="row" justifyContent="flex-end" spacing={1}>
											<IconButton onClick={() => handleEdit(supplier)}>
												<EditIcon />
											</IconButton>

											<IconButton onClick={() => handleView(supplier)}>
												<ViewIcon />
											</IconButton>

											<Tooltip title={supplier.archive ? "Restore" : "Archive"}>
												<IconButton
													color={supplier.archive ? "success" : "default"}
													onClick={() => handleArchiveRestore(supplier)}
												>
													{supplier.archive ? <UnarchiveIcon /> : <ArchiveIcon />}
												</IconButton>
											</Tooltip>
										</Stack>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
}