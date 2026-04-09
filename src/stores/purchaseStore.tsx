import "client-only"

import { collection, onSnapshot, query } from "firebase/firestore";

import { COLLECTIONS } from "@/constants/keys";
import { PurchaseType } from "@/types/PurchaseTypes"
import { create } from "zustand";
import { db } from "@/libs/firebaseClientConfig";
import { useEffect } from "react";

export type PurchaseStore = {
	purchases: PurchaseType[];
	setPurchases: (purchase: PurchaseType[]) => void;
}

export const purchaseStore = create<PurchaseStore>((set) => ({
	purchases: [],
	setPurchases: (purchases) => set({ purchases }),
}))

export function usePurchase() {
	const purchases = purchaseStore((s) => s.purchases);
	const setPurchases = purchaseStore((s) => s.setPurchases);

	useEffect(() => {
		const q = query(collection(db, COLLECTIONS.PURCHASE));

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const purchaseList = snapshot.docs.map((purchase) => ({
				...purchase.data(),
			}) as PurchaseType);

			setPurchases(purchaseList);
		});

		return () => unsubscribe();
	}, [setPurchases])

	return purchases;
}