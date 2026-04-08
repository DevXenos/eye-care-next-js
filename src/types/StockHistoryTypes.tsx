import { CreatedAt, Prefix } from "./UtilsType";
import { ProductType } from "./ProductTypes";

export type StockHistoryType = {
	id: Prefix<"SH-">;
	productId: ProductType['id'];
	quantity: number;
	source:
	| { type: "manual"; note?: string }           // manually added via product creation or adjustment
	| { type: "pos"; saleId: string }             // sold through POS
	| { type: "supplier"; purchaseId: string };  // restocked from supplier
	createdAt: CreatedAt;
};