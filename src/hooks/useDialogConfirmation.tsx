"use client"

import { useDialog } from "@/providers/DialogProvider"
import { Box, Typography, Stack } from "@mui/material";
import React, { useCallback } from "react";

export type Options = {
	title: string;
	message: string;
	buttons: React.ReactNode;
};

export default function useDialogConfirmation() {

	const { openDialog, removeDialog } = useDialog();

	// ✅ Close by id
	const closeConfirmation = useCallback(
		(dialogId: string) => {
			removeDialog(dialogId);
		},
		[removeDialog]
	);

	// ✅ Open confirmation dialog
	const openConfirmation = useCallback(
		(options: Options) => {

			const dialogId = openDialog(
				<Box>
					<Stack spacing={2}>

						{/* Title */}
						<Typography variant="h6" fontWeight={600}>
							{options.title}
						</Typography>

						{/* Message */}
						<Typography variant="body2">
							{options.message}
						</Typography>

						{/* Buttons */}
						<Stack direction="row" justifyContent="end" gap={2}>
							{options.buttons}
						</Stack>

					</Stack>
				</Box>,
				{
					showCloseButton: false,
				}
			);

			return dialogId;
		},
		[openDialog]
	);

	return { openConfirmation, closeConfirmation };
}