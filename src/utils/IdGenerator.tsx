import { ProductType } from "@/types/ProductTypes";
import { PurchaseType } from "@/types/PurchaseTypes";
import { SalesType } from "@/types/SalesType";
import { StockHistoryType } from "@/types/StockHistoryTypes";
import { SupplierType } from "@/types/SupplierTypes";

function randomPart(length = 8): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export function generateProductId(): ProductType['id'] {
	return `PROD-${randomPart(6)}`;
}

export function generateSaleId(): SalesType['id'] {
	return `SL-${randomPart(10)}`;
}

export function generateStockHistoryId(): StockHistoryType['id'] {
	return `SH-${randomPart(12)}`;
}

export function generateSupplierId(): SupplierType['id'] {
	return `SUP-${randomPart(5)}`;
}

export function generatePurchaseId(): PurchaseType['id'] {
	return `PUR-${randomPart(15)}`;
}