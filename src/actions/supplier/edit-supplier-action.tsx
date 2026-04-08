"use server";

import FormDataSerializer from "@/utils/FormDataSerializer";
import { SupplierType } from "@/types/SupplierTypes";
import admin from "@/libs/firebaseAdminConfig";

export type EditSupplierFormData =
	Partial<Omit<SupplierType, "createdAt" | "updatedAt">> &
	Pick<SupplierType, "id">;

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function editSupplierAction(
	_: unknown,
	formData: FormData
): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const data =
			FormDataSerializer.get<EditSupplierFormData>(
				formData
			);

		if (!data)
			throw new Error("Invalid form data");

		if (!data.id)
			throw new Error("Supplier ID is required");

		const supplierRef = db
			.collection("suppliers")
			.doc(data.id);

		const snapshot =
			await supplierRef.get();

		if (!snapshot.exists)
			throw new Error("Supplier not found");

		const now =
			admin.firestore.Timestamp.now();

		// Prevent updating restricted fields
		const { ...safeData } =
			data as EditSupplierFormData & {
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