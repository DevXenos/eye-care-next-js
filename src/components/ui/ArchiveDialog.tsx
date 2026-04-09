// "use client"

import "client-only";

import { ArchiveIcon, UnarchiveIcon } from "@/constants/icons";
import { Button, ButtonOwnProps, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import DialogProvider, { Dialog, DialogTrigger, useDialog } from "../dialog";

export type ArchiveDialogProps = {
	isArchived: boolean|undefined;
	title: string;
	messageToArchive: string;
	messageToUnarchive: string;
	onConfirm: (archive: boolean) => Promise<void>;
	onCancel?: () => void;
}

function View({ isArchived, title, messageToArchive, messageToUnarchive, onCancel, onConfirm }: ArchiveDialogProps) {

	const { setOpen } = useDialog();
	const color: ButtonOwnProps['color'] = isArchived ? "primary" : "error";
	
	return (
		<Dialog>
			<DialogTitle>
				{isArchived
					? `Do you want to unarchive "${title}"?`
					: `Do you want to archive "${title}"?`}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{isArchived ? messageToUnarchive : messageToArchive}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => {
					setOpen(false);
					onCancel?.();
				}}>Cancel</Button>
				<Button
					onClick={async () => {
						try {
							await onConfirm(!isArchived);
							setOpen(false);
						}catch{}
					}}
					color={color} variant="contained">{isArchived ? "UnArchive":"Archive"}</Button>
			</DialogActions>
		</Dialog>
	)
}

export default function ArchiveDialog(props: ArchiveDialogProps) {

	const { isArchived } = props;

	return (<DialogProvider>
		<DialogTrigger component={IconButton}>
			{isArchived ? <UnarchiveIcon color="primary" /> : <ArchiveIcon color="error" />}
		</DialogTrigger>
		<View {...props} />
	</DialogProvider>)
}