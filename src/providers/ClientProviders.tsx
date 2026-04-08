"use client"

import { DialogProvider, DialogRenderer } from "./DialogProvider";

import { LayoutProp } from "@/types/LayoutProp";
import MaterialProvider from "./MaterialProvider";
import { Toaster } from "sonner";

export default function ClientProviders({ children }: LayoutProp) {
	return (
		<MaterialProvider>
			<DialogProvider>
				<DialogRenderer />
				<Toaster richColors />
				{children}
			</DialogProvider>
		</MaterialProvider>
	)
}