"use server"

import admin from "@/libs/firebaseAdminConfig";
import { COLLECTIONS } from "@/constants/keys";
import { generateStockHistoryId } from "@/utils/IdGenerator";
import { StockHistoryType } from "@/types/StockHistoryTypes";
import { ProductType } from "@/types/ProductTypes";


// Reusable helper
export async function recordStockHistoryHelper(data: Omit<StockHistoryType, "id" | "createdAt">) {
	const db = admin.firestore();

	const stockHistory: StockHistoryType = {
		...data,
		id: generateStockHistoryId(),
		createdAt: admin.firestore.Timestamp.now()
	};

	await db
		.collection(COLLECTIONS.STOCK_HISTORY)
		.doc(stockHistory.id)
		.set(stockHistory);

	return stockHistory;
}


// Server Action (used by forms / useActionState)
export default async function recordStockHistory(_: unknown, formData: FormData) {
	try {

		const data = Object.fromEntries(formData.entries());

		await recordStockHistoryHelper({
			// productId: data
			quantity: Number(data.quantity),
			source: JSON.parse(data.source as string),
			productId: data.productId as ProductType['id']
		});

		return { success: true };

	} catch (e) {
		return {
			success: false,
			error: (e as Error).message
		};
	}
}