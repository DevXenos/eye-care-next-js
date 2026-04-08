"use server";

import { COLLECTIONS } from "@/constants/keys";
import admin from "@/libs/firebaseAdminConfig";
import {
	ProductFormData,
	ProductType,
} from "@/types/ProductTypes";
import FormDataSerializer from "@/utils/FormDataSerializer";

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export type EditFormData =
	Partial<ProductFormData> &
	Pick<ProductType, "id"> & Pick<ProductType, "createdAt">;

export default async function editProductAction(
	_: unknown,
	formData: FormData
): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const data =
			FormDataSerializer.get<EditFormData>(
				formData
			);

		if (!data)
			throw new Error("Invalid form data");

		if (!data.id)
			throw new Error("Product ID is required");

		const productRef = db
			.collection(COLLECTIONS.PRODUCTS)
			.doc(data.id);

		const snapshot = await productRef.get();

		if (!snapshot.exists)
			throw new Error("Product not found");

		const now =
			admin.firestore.Timestamp.now();

		// ❌ Remove fields that must NEVER be updated
		const {
			id,
			createdAt,
			stockQuantity,
			...safeData
		} = data;

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

		await productRef.update(updateData);

		return { success: true };
	} catch (e) {
		return {
			success: false,
			error: (e as Error).message,
		};
	}
}