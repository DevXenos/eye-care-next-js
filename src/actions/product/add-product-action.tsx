"use server";
import { COLLECTIONS } from "@/constants/keys";
import admin from "@/libs/firebaseAdminConfig";
import { ProductFormData, ProductType } from "@/types/ProductTypes";
import { generateProductId } from "@/utils/IdGenerator";
import { recordStockHistoryHelper } from "../stock-history/record-stock-history";
import FormDataSerializer from "@/utils/FormDataSerializer";

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function addProductAction(_: unknown, formData: FormData): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const data = FormDataSerializer.get<ProductFormData>(formData);

		if (!data) throw new Error("Data not exists");

		const product: ProductType = {
			createdAt: admin.firestore.Timestamp.now(),
			updatedAt: admin.firestore.Timestamp.now(),
			id: generateProductId(),
			barcode: data.barcode as ProductFormData['barcode'],
			name: data.name,
			category: data.category,
			brand: data.brand,
			price: Number(data.price),
			stockQuantity: Number(data.stockQuantity)
		}

		const setProductPromise = db.collection(COLLECTIONS.PRODUCTS).doc(product.id).set(product);

		await Promise.all([
			setProductPromise,
			recordStockHistoryHelper({
				productId: product.id,
				quantity: product.stockQuantity,
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