"use server"

import { SupplierType } from "@/types/SupplierTypes";
import admin from "@/libs/firebaseAdminConfig";
import { generateSupplierId } from "@/utils/IdGenerator";

export type SupplierFormData = Omit<SupplierType, 'id' | 'createdAt' | 'updatedAt'>;

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function addSupplierAction(supplier: SupplierFormData): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const now = admin.firestore.Timestamp.now();

		const newSupplier: SupplierType = {
			...supplier,
			id: generateSupplierId(),
			createdAt: now,
			updatedAt: now,
		};

		await db.collection("suppliers").doc(newSupplier.id).set(newSupplier, {merge: true});

		return { success: true };
	} catch (e) {
		return {
			success: false,
			error: (e as Error).message
		};
	}
}