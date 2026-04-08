"use server";

import { COLLECTIONS } from "@/constants/keys";
import admin from "@/libs/firebaseAdminConfig";
import { PurchaseType } from "@/types/PurchaseTypes";
import FormDataSerializer from "@/utils/FormDataSerializer";
import { generatePurchaseId, generateStockHistoryId } from "@/utils/IdGenerator";
import { StockHistoryType } from "@/types/StockHistoryTypes";

export type AddPurchaseInput = Omit<
	PurchaseType,
	"id" | "createdAt" | "updatedAt"
>;

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function addPurchaseAction(
	prev: unknown,
	formData: FormData
): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const input = FormDataSerializer.get<AddPurchaseInput>(formData);
		if (!input) {
			throw new Error("Data is not set.");
		}

		const purchaseId = generatePurchaseId();
		const purchaseRef = db.collection(COLLECTIONS.PURCHASE).doc(purchaseId);

		await db.runTransaction(async (transaction) => {

			const now = admin.firestore.Timestamp.now();

			const purchaseData: PurchaseType = {
				...input,
				id: purchaseId,
				createdAt: now,
				updatedAt: now,
			};

			const productSnapshots: Record<string, admin.firestore.DocumentSnapshot> = {};

			// ✅ READ PHASE (ALL READS FIRST)
			if (purchaseData.orders.status === "completed") {

				for (const item of purchaseData.orders.products) {
					const productRef = db
						.collection(COLLECTIONS.PRODUCTS)
						.doc(item.id);

					const snap = await transaction.get(productRef);

					if (!snap.exists) {
						throw new Error(`Product not found: ${item.id}`);
					}

					productSnapshots[item.id] = snap;
				}
			}

			// ✅ WRITE PHASE

			transaction.set(purchaseRef, purchaseData);

			if (purchaseData.orders.status === "completed") {

				for (const item of purchaseData.orders.products) {

					const productRef = db
						.collection(COLLECTIONS.PRODUCTS)
						.doc(item.id);

					const productSnap = productSnapshots[item.id];
					const productData = productSnap.data();

					const newStockQuantity =
						(productData?.stockQuantity ?? 0) + item.received;

					transaction.update(productRef, {
						stockQuantity: newStockQuantity
					});

					const stockHistoryId = generateStockHistoryId();
					const historyRef = db
						.collection(COLLECTIONS.STOCK_HISTORY)
						.doc(stockHistoryId);

					const stockHistory: StockHistoryType = {
						id: stockHistoryId,
						productId: item.id,
						quantity: item.received,
						source: {
							type: "supplier",
							purchaseId: purchaseId
						},
						createdAt: now
					};

					transaction.set(historyRef, stockHistory);
				}
			}
		});

		return { success: true };

	} catch (e) {
		return {
			success: false,
			error: (e as Error).message,
		};
	}
}