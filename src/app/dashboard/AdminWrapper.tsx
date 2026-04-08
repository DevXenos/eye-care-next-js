"use client"

import { createContext, useContext, useEffect } from "react";

import { LayoutProp } from "@/types/LayoutProp";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { User } from "firebase/auth";
import { useCurrentUser } from "@/stores/currentUserStore";
import { useRouter } from "next/navigation";

export const AdminContext = createContext<User | undefined>(undefined);

export function AdminContextProvider({ children }: LayoutProp) {
	const navigate = useRouter();

	const [currentUser, isLoading] = useCurrentUser();

	useEffect(() => {
		if (!currentUser) {
			return navigate.replace("/");
		};
	}, [currentUser, navigate]);

	if (!currentUser || isLoading) return <LoadingScreen />;

	return (
		<AdminContext.Provider value={currentUser}>
			{children}
		</AdminContext.Provider>
	);
}

export function useAdmin() {
	const context = useContext(AdminContext);
	if (!context) throw new Error(`'${useAdmin.name}' must used inside of '${AdminContextProvider.name}'`)
	return context;
}