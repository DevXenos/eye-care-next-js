"use client"

import { collection, onSnapshot, query } from "firebase/firestore";

import { COLLECTIONS } from "@/constants/keys";
import { SalesType } from "@/types/SalesType"
import { create } from "zustand";
import { db } from "@/libs/firebaseClientConfig";
import { useEffect } from "react";

export type SalesReportStoreState = {
	sales: SalesType[];
	setSales: (sales: SalesType[]) => void;
}

export const salesReportStore = create<SalesReportStoreState>((set) => ({
	sales: [],
	setSales: (sales) => set({ sales }),
}));

export function useSalesReport() {
	const { sales, setSales } = salesReportStore.getState();

	useEffect(() => {
		const q = query(collection(db, COLLECTIONS.SALES_REPORT));

		const unsubscribe = onSnapshot(q, (snapshopt) => {
			const salesList = snapshopt.docs.map((doc) => ({
				...doc.data(),
			} as SalesType));

			setSales(salesList);
		});

		return () => unsubscribe();
	}, [setSales])

	return sales;
}