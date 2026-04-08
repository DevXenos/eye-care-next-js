"use server";

import { __DEV__ } from "@/constants/envFlags";
import { COLLECTIONS } from "@/constants/keys";
import admin from "@/libs/firebaseAdminConfig";
import { ProductType } from "@/types/ProductTypes";
import { PurchaseType } from "@/types/PurchaseTypes";
import { StockHistoryType } from "@/types/StockHistoryTypes";
import FormDataSerializer from "@/utils/FormDataSerializer";
import { generateStockHistoryId } from "@/utils/IdGenerator";

export type ReceivePurchaseInput = {
	id: PurchaseType["id"];
	orders: Pick<PurchaseType["orders"], "products" | "status">;
};

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function receivePurchaseAction(
	_: unknown,
	formData: FormData
): Promise<ReturnType> {
	try {
		const input = FormDataSerializer.get<ReceivePurchaseInput>(formData);
		if (!input) throw new Error("No Data");

		if(__DEV__)
			console.log(JSON.stringify(input, null, 4));

		const db = admin.firestore();

		await db.runTransaction(async (transaction) => {

			const now = admin.firestore.Timestamp.now();

			const purchaseRef = db
				.collection(COLLECTIONS.PURCHASE)
				.doc(input.id);

			// =========================
			// 1️⃣ READ PHASE
			// =========================

			const purchaseSnap = await transaction.get(purchaseRef);

			if (!purchaseSnap.exists) {
				throw new Error("Purchase not found.");
			}

			const productDataMap: {
				productRef: FirebaseFirestore.DocumentReference;
				productData: FirebaseFirestore.DocumentData;
				received: number;
			}[] = [];

			for (const item of input.orders.products) {

				const productRef = db
					.collection(COLLECTIONS.PRODUCTS)
					.doc(item.id);

				const productSnap = await transaction.get(productRef);

				if (!productSnap.exists) {
					throw new Error(`Product not found: ${item.id}`);
				}

				productDataMap.push({
					productRef,
					productData: productSnap.data()!,
					received: item.received ?? 0
				});
			}

			// =========================
			// 2️⃣ WRITE PHASE
			// =========================

			// Update Purchase
			transaction.update(purchaseRef, {
				orders: input.orders,
				updatedAt: now
			});

			// Update Products + History
			for (const item of productDataMap) {

				const newStock =
					(item.productData.stockQuantity ?? 0) +
					item.received;

				transaction.update(item.productRef, {
					stockQuantity: newStock
				});

				const historyId = generateStockHistoryId();

				const historyRef = db
					.collection(COLLECTIONS.STOCK_HISTORY)
					.doc(historyId);

				const stockHistory: StockHistoryType = {
					id: historyId,
					productId: item.productRef.id as ProductType['id'],
					quantity: item.received,
					source: {
						type: "supplier",
						purchaseId: input.id
					},
					createdAt: now
				};

				transaction.set(historyRef, stockHistory);
			}
		});

		return { success: true };

	} catch (e) {
		const mess = (e as Error).message;
		if (__DEV__) console.error(mess);
		
		return {
			success: false,
			error: mess,
		};
	}
}