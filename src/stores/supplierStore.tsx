"use client";

import { collection, onSnapshot, query } from "firebase/firestore";

import { COLLECTIONS } from "@/constants/keys";
import { SupplierType } from "@/types/SupplierTypes";
import { create } from "zustand";
import { db } from "@/libs/firebaseClientConfig";
import { useEffect } from "react";

export type SupplierStoreState = {
	suppliers: SupplierType[];
	setSuppliers: (suppliers: SupplierType[]) => void;
	addSupplier: (supplier: SupplierType) => void;
	getSupplierById: (id: SupplierType["id"]) => SupplierType | undefined;
};

export const supplierStore = create<SupplierStoreState>((set, get) => ({
	suppliers: [],

	setSuppliers: (suppliers) => set({ suppliers }),

	addSupplier: (supplier) => {
		const suppliers = get().suppliers;
		set({
			suppliers: [supplier, ...suppliers],
		});
	},

	getSupplierById: (id) =>
		get().suppliers.find((supplier) => supplier.id === id),
}));

function register(cb: (list: SupplierType[]) => void) {
	const q = query(collection(db, COLLECTIONS.SUPPLIER));

	return onSnapshot(q, (snapshot) => {
		const supplierList = snapshot.docs.map(
			(doc) =>
			({
				id: doc.id,
				...doc.data(),
			} as SupplierType)
		);

		cb(supplierList);
	});
}

export function useSuppliers() {
	const suppliers = supplierStore((state) => state.suppliers);
	const setSuppliers = supplierStore((state) => state.setSuppliers);
	const getSupplierById = supplierStore((state) => state.getSupplierById);

	useEffect(() => {
		const unsubscribe = register((list) => {
			setSuppliers(list);
		});

		return () => unsubscribe();
	}, [setSuppliers]);

	return { suppliers, getSupplierById };
}