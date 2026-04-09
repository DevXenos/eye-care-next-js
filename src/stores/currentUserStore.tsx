"use client"

import React, { createContext, useContext } from "react";

import { AdminAccount } from "@/types/AdminAccountTypes";

export type AdminAccountContextType = {
	currentAdmin: AdminAccount;
}

export const AdminAccountContext = createContext<AdminAccountContextType | undefined>(undefined);

export function AdminAccountProvider({ children, currentAdmin }: { children: React.ReactNode, currentAdmin: AdminAccount }) {

	return (
		<AdminAccountContext.Provider value={{ currentAdmin}}>
			{children}
		</AdminAccountContext.Provider>
	)
}

export default function useAdminAccount() {
	const context = useContext(AdminAccountContext);
	if (!context) throw new Error("useAdminAccount must be used in /dashboard/* only")
	return context;
}