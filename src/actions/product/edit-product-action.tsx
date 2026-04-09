"use server"

import {
	ProductFormData,
	ProductType,
} from "@/types/ProductTypes";

import { COLLECTIONS } from "@/constants/keys";
import admin from "@/libs/firebaseAdminConfig";

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export type EditFormData = Partial<ProductFormData>;

export default async function editProductAction(
	id: ProductType['id'],
	product: EditFormData
): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const productRef = db
			.collection(COLLECTIONS.PRODUCTS)
			.doc(id);

		const snapshot = await productRef.get();

		if (!snapshot.exists)
			throw new Error("Product not found");

		const now =
			admin.firestore.Timestamp.now();

		const {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			stockQuantity,
			...safeData
		} = product;

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