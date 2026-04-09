"use server";

import { SupplierType } from "@/types/SupplierTypes";
import admin from "@/libs/firebaseAdminConfig";

export type EditSupplierFormData = 
	Partial<Omit<SupplierType, "updatedAt">> &
	Pick<SupplierType, "id">;

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function editSupplierAction(
	supplier: EditSupplierFormData
): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const supplierRef = db
			.collection("suppliers")
			.doc(supplier.id);

		const snapshot =
			await supplierRef.get();

		if (!snapshot.exists)
			throw new Error("Supplier not found");

		const now =
			admin.firestore.Timestamp.now();

		// Prevent updating restricted fields
		const { ...safeData } =
			supplier as EditSupplierFormData & {
				createdAt?: unknown;
			};

		const updateData = {
			...safeData,
			updatedAt: now,
		};

		// Remove undefined values
		Object.keys(updateData).forEach((key) => {
			if (
				updateData[
				key as keyof typeof updateData
				] === undefined
			) {
				delete updateData[
					key as keyof typeof updateData
				];
			}
		});

		await supplierRef.update(updateData);

		return { success: true };
	} catch (e) {
		return {
			success: false,
			error: (e as Error).message,
		};
	}
}