"use server";

import { generateSaleId, generateStockHistoryId } from "@/utils/IdGenerator";

import { COLLECTIONS } from "@/constants/keys";
import { SalesType } from "@/types/SalesType";
import { StockHistoryType } from "@/types/StockHistoryTypes";
import admin from "@/libs/firebaseAdminConfig";

type ReturnType =
	| { success: true }
	| { success: false; error: string };

export default async function addSalesAction(_: unknown, formData: FormData): Promise<ReturnType> {
	try {
		const db = admin.firestore();

		const data = Object.fromEntries(formData.entries()) as unknown as Omit<SalesType, 'id' | 'createdAt' | 'totalAmount'>;

		const carts = data.carts
			? JSON.parse(data.carts as any) as SalesType['carts']
			: [];

		// Calculate total
		const totalAmount = carts.reduce(
			(sum, pro) => sum + Number(pro.price) * Number(pro.quantity),
			0
		);

		const sale: SalesType = {
			id: generateSaleId(),
			customerName: data.customerName,
			carts,
			totalAmount,
			createdAt: admin.firestore.Timestamp.now(),
		};

		// Run **one transaction** for all stock updates + sale
		await db.runTransaction(async (transaction) => {

			const productDocs = [];

			// 1️⃣ READ everything first
			for (const item of carts) {
				const productRef = db.collection(COLLECTIONS.PRODUCTS).doc(item.productId);
				const doc = await transaction.get(productRef);

				if (!doc.exists) throw new Error(`Product ${item.productId} not found`);

				productDocs.push({
					item,
					ref: productRef,
					data: doc.data()
				});
			}

			// 2️⃣ PERFORM WRITES
			for (const { item, ref, data } of productDocs) {

				const currentStock = data?.stockQuantity ?? 0;
				const newStock = currentStock - item.quantity;

				if (newStock < 0) throw new Error(`Not enough stock for ${item.productId}`);

				// update inventory
				transaction.update(ref, { stockQuantity: newStock });

				const stock: StockHistoryType = {
					id: generateStockHistoryId(),
					productId:  item.productId,
					quantity: -item.quantity,
					source: {
						type: "pos",
						saleId: sale.id,
					},
					createdAt: admin.firestore.Timestamp.now(),
				}

				const stockHistoryRef = db
					.collection(COLLECTIONS.STOCK_HISTORY)
					.doc(stock.id);
				
				transaction.set(stockHistoryRef, stock);
			}

			// 3️⃣ save sale
			const saleRef = db.collection(COLLECTIONS.SALES_REPORT).doc(sale.id);
			transaction.set(saleRef, sale);
		});

		// recordStockHistoryHelper({
		// 	product: undefined,
		// 	quantity: 0,
		// 	source: {
		// 		type: "manual",
		// 		note: undefined
		// 	}
		// })

		return { success: true };
	} catch (e) {
		return { success: false, error: (e as Error).message };
	}
}