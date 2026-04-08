import "client-only";

import { User, onAuthStateChanged } from "firebase/auth";

import { auth } from "@/libs/firebaseClientConfig";
import { create } from "zustand";
import { useEffect } from "react";

export type CurrentUserState = {
	isLoading: boolean;
	currentUser: User | null;
	setCurrentUser: (user: User|null) => void;
}

export const currentUserStore = create<CurrentUserState>((set) => ({
	isLoading: true,
	currentUser: null,
	setCurrentUser: (user) => set({
		isLoading: false,
		currentUser: user,
	})
}))

export function useCurrentUser() {
	const isLoading = currentUserStore.getState().isLoading;
	const currentUser = currentUserStore.getState().currentUser;
	const setCurrentUser = currentUserStore.getState().setCurrentUser;

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
		});

		return () => {
			unsubscribe();
		}
	});

	return [currentUser, isLoading] as const;
}