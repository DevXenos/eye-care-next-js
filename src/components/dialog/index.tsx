import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import MUIDialog, {DialogProps as MUIDialogProps} from "@mui/material/Dialog";

import { Button } from "@mui/material";

export type DialogContextType = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
} & Pick<DialogProviderProps,
	| "closeOnClickEsc"
	| "closeOnClickOutside"
>;

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export type DialogProviderProps = {
	children: React.ReactNode;

	/**
	 * @default {true}
	 */
	closeOnClickOutside?: boolean;

	/**
	 * @default {true}
	 */
	closeOnClickEsc?: boolean;
}

export default function DialogProvider({
	children,
	closeOnClickOutside
}: DialogProviderProps) {
	const [open, setOpen] = useState(false);

	return (
		<DialogContext.Provider value={{
			open,
			setOpen,
			closeOnClickOutside
		}}>
			{children}
		</DialogContext.Provider>
	)
}

export type TriggerMode = "open" | "close" | "toggle";

export type DialogTriggerProps<T extends React.ElementType = typeof Button> = {
	component?: T;

	/**
	 * @default "toggle"
	 */
	triggerMode?: TriggerMode;
} & React.ComponentPropsWithoutRef<T>;

export function DialogTrigger({
	component,
	triggerMode = 'toggle',
	...rest
}: DialogTriggerProps) {
	const { open, setOpen } = useDialog();

	const Component = component || Button;

	return (
		<Component
			{...rest}
			onClick={() => {
				if (triggerMode === "open") setOpen(true);
				else if (triggerMode === 'close') setOpen(false);
				else setOpen(!open)
			}}
		/>
	)
}

/**
 * Extract MUI's original onClose parameter types
 */
type MuiOnClose = NonNullable<MUIDialogProps["onClose"]>;
type MuiCloseEvent = Parameters<MuiOnClose>[0];
type MuiCloseReason = Parameters<MuiOnClose>[1];

export type DialogProps<T extends React.ElementType = React.ElementType> = {
	component?: T;
	/**
	 * Called when dialog attempts to close.
	 *
	 * Return:
	 * - true  → run default closing behavior
	 * - false → prevent default closing behavior
	 */
	onClose?: (event: MuiCloseEvent, reason: MuiCloseReason) => boolean;
}
	& Omit<
		MUIDialogProps,
		| "open"
		| "onClose"
		| "component"
	>
	& Omit<React.ComponentPropsWithoutRef<T>, "children">

export function Dialog({ onClose, ...rest }: DialogProps) {
	const {
		open,
		setOpen,
		closeOnClickOutside = true,
		closeOnClickEsc = true
	} = useDialog();

	const handleClose: MuiOnClose = (event, reason) => {
		const isBackdropClick = reason === "backdropClick";
		const isEscapeKey = reason === "escapeKeyDown";

		// Check if closing is allowed by internal configuration
		const allowedByConfig =
			(isBackdropClick && closeOnClickOutside) ||
			(isEscapeKey && closeOnClickEsc);

		// Let consumer override default behavior
		const shouldRunDefault = onClose?.(event, reason) ?? true;

		if (!shouldRunDefault) return;

		if (allowedByConfig) {
			setOpen(false);
		}
	};

	return (
		<MUIDialog
			{...rest}
			open={open}
			onClose={handleClose}
		/>
	);
}

export function useDialog() {
	const context = useContext(DialogContext);
	if (!context) throw new Error("useDialog must be used inside DialogProvider");
	return context;
}