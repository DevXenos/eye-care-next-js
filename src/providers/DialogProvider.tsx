"use client";

import {
	Breakpoint,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fade,
	Dialog as MUIDialog,
} from "@mui/material";
import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";

/* ================================
   Types
================================ */

export type DialogOptions = {
	position?: number;
	maxWidth?: false | Breakpoint;
	showCloseButton?: boolean;
	closeOnClickOutside?: boolean;
	onClose?: () => void; // ✅ New: Callback when dialog closes
};

export type Dialog = {
	id: string;
	title?: ReactNode;
	content: ReactNode;
	isOpen: boolean;
} & DialogOptions;

export type DialogContextType = {
	addDialog: (id: string, title: ReactNode, content: ReactNode, options?: DialogOptions) => void;
	showDialog: (id: string, options?: DialogOptions) => void;
	closeDialog: (id: string) => void;
	removeDialog: (id: string) => void;
	updateDialog: (id: string, updates: Partial<Omit<Dialog, "id">>) => void;
	openDialog: (content: ReactNode, options?: Omit<Dialog, "id" | "content" | "isOpen">) => string;
	dialogs: Dialog[];
};

/* ================================
   Context
================================ */

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

/* ================================
   Provider
================================ */

/**
 * @deprecated {Converting to advance DialogProvider}
 */
export function DialogProvider({ children }: { children: ReactNode }) {
	const [dialogs, setDialogs] = useState<Dialog[]>([]);

	const defaultOptions: DialogOptions = {
		position: undefined,
		maxWidth: "sm",
		showCloseButton: true,
		closeOnClickOutside: true,
	};

	const addDialog: DialogContextType["addDialog"] = useCallback(
		(id, title, content, options) => {
			setDialogs((prev) => {
				if (prev.some((d) => d.id === id)) return prev;
				return [
					...prev,
					{
						id,
						title,
						content,
						isOpen: false,
						...defaultOptions,
						...options,
					},
				];
			});
		},
		[]
	);

	const showDialog: DialogContextType["showDialog"] = useCallback((id, options) => {
		setDialogs((prev) =>
			prev.map((dialog) =>
				dialog.id === id
					? { ...dialog, isOpen: true, ...options }
					: dialog
			)
		);
	}, []);

	const closeDialog = useCallback((id: string) => {
		setDialogs((prev) =>
			prev.map((dialog) =>
				dialog.id === id ? { ...dialog, isOpen: false } : dialog
			)
		);
	}, []);

	const removeDialog = useCallback((id: string) => {
		setDialogs((prev) => prev.filter((d) => d.id !== id));
	}, []);

	const updateDialog: DialogContextType["updateDialog"] = useCallback(
		(id, updates) => {
			setDialogs((prev) =>
				prev.map((dialog) => (dialog.id === id ? { ...dialog, ...updates } : dialog))
			);
		},
		[]
	);

	const openDialog: DialogContextType["openDialog"] = useCallback(
		(content: ReactNode, options?: Omit<Dialog, "id" | "content" | "isOpen">) => {
			const id = crypto.randomUUID();
			setDialogs((prev) => [
				...prev,
				{
					id,
					content,
					isOpen: true,
					...defaultOptions,
					...options,
				},
			]);
			return id;
		},
		[]
	);

	return (
		<DialogContext.Provider
			value={{
				addDialog,
				showDialog,
				closeDialog,
				removeDialog,
				updateDialog,
				openDialog,
				dialogs,
			}}
		>
			{children}
		</DialogContext.Provider>
	);
}

/* ================================
   Hook
================================ */

/**
 * @deprecated {Converting to advance DialogProvider}
 */
export function useDialog() {
	const context = useContext(DialogContext);
	if (!context) throw new Error("useDialog must be used inside DialogProvider");
	return context;
}

/* ================================
   Dialog Renderer
================================ */

/**
 * @deprecated {Converting to advance DialogProvider}
 */
export const DialogRenderer = () => {
	const { dialogs, closeDialog } = useDialog();

	// Centralized handler to ensure onClose callback is respected
	const handleClose = (dialog: Dialog) => {
		if (dialog.onClose) {
			dialog.onClose();
		}
		closeDialog(dialog.id);
	};

	return (
		<>
			{dialogs.map((dialog) => (
				<MUIDialog
					key={dialog.id}
					open={dialog.isOpen}
					onClose={(_, reason) => {
						// Prevent closing if user clicks outside and option is false
						if (reason === "backdropClick" && dialog.closeOnClickOutside === false) {
							return;
						}
						handleClose(dialog);
					}}
					maxWidth={dialog.maxWidth ?? "sm"}
					fullWidth={!!dialog.maxWidth}
					TransitionComponent={Fade}
					keepMounted
				>
					{dialog.title && <DialogTitle>{dialog.title}</DialogTitle>}
					<DialogContent dividers>{dialog.content}</DialogContent>

					{dialog.showCloseButton && (
						<DialogActions>
							<Button onClick={() => handleClose(dialog)}>
								Close
							</Button>
						</DialogActions>
					)}
				</MUIDialog>
			))}
		</>
	);
};