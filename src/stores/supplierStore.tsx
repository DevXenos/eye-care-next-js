"use client"

import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

import { COLLECTIONS } from "@/constants/keys";
import { LayoutProp } from "@/types/LayoutProp";
import { SupplierType } from "@/types/SupplierTypes"
import { create } from "zustand";
import { db } from "@/libs/firebaseClientConfig";

export type SupplierStoreState = {
	suppliers: SupplierType[];
	setSuppliers: (suppliers: SupplierType[]) => void;
	getSupplierById: (id: SupplierType['id']) => SupplierType|undefined;
}

export const supplierStore = create<SupplierStoreState>((set, get) => ({
	suppliers: [],
	setSuppliers: (suppliers) => set({ suppliers }),
	getSupplierById: (id) => get().suppliers.find((supplier) => supplier.id === id)
}));

export function useSuppliers() {
	const { suppliers, setSuppliers, getSupplierById } = supplierStore.getState();

	useEffect(() => {
		const q = query(collection(db, COLLECTIONS.SUPPLIER));

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const supplierList = snapshot.docs.map((supplier) => ({
				...supplier.data()
			} as SupplierType));

			setSuppliers(supplierList);
		});

		return () => unsubscribe();
	}, [setSuppliers])

	return { suppliers, getSupplierById };
}

