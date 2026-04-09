"use server";

import { COLLECTIONS } from "@/constants/keys";
import { ProductType } from "@/types/ProductTypes";
import admin from "@/libs/firebaseAdminConfig";
import { generateProductId } from "@/utils/IdGenerator";
import { recordStockHistoryHelper } from "../stock-history/record-stock-history";

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function addProductAction(product: Omit<ProductType, 'id'|"createdAt"|"updatedAt"|"archive">): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const newProduct: ProductType = {
			createdAt: admin.firestore.Timestamp.now(),
			updatedAt: admin.firestore.Timestamp.now(),
			...product,
			id: generateProductId(),
		}

		const setProductPromise = db.collection(COLLECTIONS.PRODUCTS).doc(newProduct.id).set(newProduct);

		await Promise.all([
			setProductPromise,
			recordStockHistoryHelper({
				productId: newProduct.id,
				quantity: newProduct.stockQuantity,
				source: {
					type: "manual",
					note: "Initial Stock"
				}
			})
		]);

		return {
			success: true,
		}
	} catch (e) {
		return {
			success: false,
			error: (e as Error).message,
		}
	}
}