"use client";

import { DateFormats } from "@/types/ProfileType";
import { SupplierType } from "@/types/SupplierTypes";
import formatDate from "@/utils/formatDate";
import {
	Box,
	Typography,
	Stack,
	Divider,
	Chip,
	Link,
	List,
	ListItem,
	ListItemText,
	Grid,
	Card,
	CardContent,
} from "@mui/material";

function getContactLink(contact: string) {
	if (contact.includes("@")) {
		return `mailto:${contact}`;
	}

	if (/^\+?[0-9\s\-()]+$/.test(contact)) {
		return `tel:${contact}`;
	}

	return null;
}

export default function SupplierView({
	id,
	name,
	address,
	contacts,
	website,
	createdAt,
	updatedAt,
	dateFormat,
}: SupplierType & { dateFormat: DateFormats }) {
	return (
		<Box sx={{ p: 1 }}>
			{/* HEADER */}
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				mb={2}
			>
				<Box>
					<Typography variant="h5" fontWeight={600}>
						{name}
					</Typography>

					<Typography
						variant="body2"
						color="text.secondary"
					>
						Supplier ID: {id}
					</Typography>
				</Box>

				<Chip
					label="Supplier"
					color="primary"
					size="small"
				/>
			</Stack>

			<Grid container spacing={2}>
				{/* ADDRESS */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Card variant="outlined">
						<CardContent>
							<Typography
								fontWeight={600}
								mb={1}
							>
								Address
							</Typography>

							<Typography color="text.secondary">
								{address ||
									"No address provided"}
							</Typography>
						</CardContent>
					</Card>
				</Grid>

				{/* WEBSITE */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Card variant="outlined" sx={{height: "100%"}}>
						<CardContent>
							<Typography
								fontWeight={600}
								mb={1}
							>
								Website
							</Typography>

							{website ? (
								<Link
									href={website}
									target="_blank"
									rel="noopener noreferrer"
								>
									{website}
								</Link>
							) : (
								<Typography color="text.secondary">
									No website provided
								</Typography>
							)}
						</CardContent>
					</Card>
				</Grid>

				{/* CONTACTS */}
				<Grid size={12}>
					<Card variant="outlined">
						<CardContent>
							<Typography
								fontWeight={600}
								mb={1}
							>
								Contacts
							</Typography>

							{contacts?.length ? (
								<List dense disablePadding>
									{contacts.map(
										(contact, index) => {
											const link =
												getContactLink(
													contact
												);

											return (
												<ListItem
													key={index}
													disableGutters
												>
													<ListItemText
														primary={
															link ? (
																<Link
																	href={
																		link
																	}
																>
																	{
																		contact
																	}
																</Link>
															) : (
																contact
															)
														}
													/>
												</ListItem>
											);
										}
									)}
								</List>
							) : (
								<Typography color="text.secondary">
									No contact information
								</Typography>
							)}
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* METADATA */}
			<Divider sx={{ my: 3 }} />

			<Stack spacing={0.5}>
				<Typography
					variant="caption"
					color="text.secondary"
				>
					Created:{" "}
					{formatDate(
						createdAt.toMillis(),
						dateFormat
					)}
				</Typography>

				{updatedAt && (
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Updated:{" "}
						{formatDate(
							updatedAt.toMillis(),
							dateFormat
						)}
					</Typography>
				)}
			</Stack>
		</Box>
	);
}