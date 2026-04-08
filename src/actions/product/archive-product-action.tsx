"use server"

import { COLLECTIONS } from "@/constants/keys";
import admin from "@/libs/firebaseAdminConfig";
import { ProductType } from "@/types/ProductTypes";

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function archiveProduct(
	productId: ProductType["id"]
): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const productRef = db
			.collection(COLLECTIONS.PRODUCTS)
			.doc(productId);

		await db.runTransaction(async (transaction) => {

			const snap = await transaction.get(productRef);

			if (!snap.exists) {
				throw new Error("Product not found.");
			}

			const current = snap.data();

			const newValue = !(current?.archive ?? false);

			transaction.update(productRef, {
				archive: newValue,
				updatedAt: admin.firestore.Timestamp.now(),
			});
		});

		return { success: true };

	} catch (e) {
		return {
			success: false,
			error: (e as Error).message,
		};
	}
}