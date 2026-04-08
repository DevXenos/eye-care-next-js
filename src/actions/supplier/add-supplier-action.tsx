"use server"

import admin from "@/libs/firebaseAdminConfig";
import { SupplierType } from "@/types/SupplierTypes";
import FormDataSerializer from "@/utils/FormDataSerializer";
import { generateSupplierId } from "@/utils/IdGenerator";

export type SupplierFormData = Omit<SupplierType, 'id' | 'createdAt' | 'updatedAt'>;

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function addSupplierAction(_: unknown, formData: FormData): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const data = FormDataSerializer.get<SupplierFormData>(formData);

		if (!data) throw new Error("Date is not set");

		const supplier: SupplierType = {
			id: generateSupplierId(),
			createdAt: admin.firestore.Timestamp.now(),
			updatedAt: admin.firestore.Timestamp.now(),
			...data
		};

		await db.collection("suppliers").doc(supplier.id).set(supplier);

		return { success: true };
	} catch (e) {
		return {
			success: false,
			error: (e as Error).message
		};
	}
}