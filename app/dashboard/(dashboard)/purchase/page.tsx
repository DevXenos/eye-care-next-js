"use client"

import {
    Button,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import { SearchBar, useSearchBar } from "@/components/ui/SearchBar";

import ActionOnTop from "@/components/ui/ActionOnTop";
import { AddIcon } from "@/constants/icons";
import ArchiveIcon from "@mui/icons-material/Archive";
import { CamelCase } from "@/utils/camelCase";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import Link from "next/link";
import { PurchaseType } from "@/types/PurchaseTypes";
import PurchaseView from "./__components/PurchaseView";
import ReceiveForm from "./__components/ReceiveForm";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useAdminAccount from "@/stores/currentUserStore";
import { useCallback } from "react";
import { useDialog } from "@/providers/DialogProvider";
import { useProfile } from "@/stores/profileStore";
import { usePurchase } from "@/stores/purchaseStore";
import { useSuppliers } from "@/stores/supplierStore";

export default function OutletSupplier() {
	const {currentAdmin} = useAdminAccount();
	const { profile } = useProfile(currentAdmin.uid);
	const  purchases = usePurchase();
	const { getSupplierById } = useSuppliers();

	const [searchQuery, onChangeQuery] = useSearchBar();
	const { openDialog, removeDialog } = useDialog();

	const handleRecieve = useCallback((purchase: PurchaseType) => {
		const id = openDialog(
			<ReceiveForm
				purchase={purchase}
				onCloseAction={() => removeDialog(id)}
			/>,
			{
				title: "Receive Purchase",
				showCloseButton: false,
				onClose: () => removeDialog(id)
			}
		)
	}, [removeDialog, openDialog]);

	const handleView = useCallback((purchase: PurchaseType) => { 
		const name = getSupplierById(purchase.supplierId)?.name || purchase.supplierId;
		const id = openDialog(
			<PurchaseView
				supplierName={name}
				dateFormat={profile.dateFormat}
				{...purchase} />,
			{
				onClose: () => removeDialog(id),
			}
		)
	}, [getSupplierById, openDialog, profile.dateFormat, removeDialog]);

	return (
		<Stack direction="column" p={2} gap={2}>

			<ActionOnTop>
				<SearchBar
					value={searchQuery}
					onChange={onChangeQuery}
				/>

				<Button
					LinkComponent={Link}
					href="/dashboard/purchase/purchase-form"
					startIcon={<AddIcon />}
					variant="outlined"
				>
					Add Purchase
				</Button>
			</ActionOnTop>

			<TableContainer>
				<Table stickyHeader>

					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Supplier</TableCell>
							<TableCell>Orders</TableCell>
							<TableCell>Status</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{purchases.map((purchase) => {

							const supplier = getSupplierById(purchase.supplierId);

							return (
								<TableRow key={purchase.id} hover>

									<TableCell>
										{purchase.id}
									</TableCell>

									<TableCell>
										{supplier?.name}
									</TableCell>

									<TableCell>
										{purchase.orders.products.length}
									</TableCell>

									<TableCell>
										{CamelCase(purchase.orders.status)}
									</TableCell>

									<TableCell align="right">
										<Stack
											direction="row"
											spacing={1}
											justifyContent="flex-end"
										>

											{/* View */}
											<Tooltip title="View">
												<IconButton
													size="small"
													color="primary"
													onClick={() => handleView(purchase)}
													aria-label="view"
												>
													<VisibilityIcon fontSize="small" />
												</IconButton>
											</Tooltip>

											{/* Pending Actions */}
											{purchase.orders.status === "pending" && (
												<>
													<Tooltip title="Receive">
														<IconButton
															size="small"
															color="success"
															aria-label="receive"
															onClick={() => handleRecieve(purchase)}
														>
															<DownloadIcon fontSize="small" />
														</IconButton>
													</Tooltip>

													<Tooltip title="Delete">
														<IconButton
															size="small"
															color="error"
															aria-label="delete"
														>
															<DeleteIcon fontSize="small" />
														</IconButton>
													</Tooltip>
												</>
											)}

											{/* Completed Actions */}
											{purchase.orders.status === "completed" && (
												<>
													{/* <Tooltip title="Return">
														<IconButton
															size="small"
															color="warning"
															LinkComponent={Link}
															href={`/dashboard/purchase/return/${purchase.id}`}
															aria-label="return"
														>
															<UndoIcon fontSize="small" />
														</IconButton>
													</Tooltip> */}

													<Tooltip title="Archive">
														<IconButton
															size="small"
															color="secondary"
															aria-label="archive"
														>
															<ArchiveIcon fontSize="small" />
														</IconButton>
													</Tooltip>
												</>
											)}
										</Stack>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>

				</Table>
			</TableContainer>

		</Stack>
	);
}