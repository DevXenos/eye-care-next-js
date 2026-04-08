import { CreatedAt, Prefix, UpdatedAt } from "./UtilsType"
import { ProductType } from "./ProductTypes";
import { SupplierType } from "./SupplierTypes";

export type PurchaseProduct = Pick<ProductType, "id" | "name"|"price"> & {
	quantity: number;
	received: number;
};

export type PurchaseReturn = Pick<ProductType, "id" | "name"> & {
	quantity: number;
	returned: number;
	condition: "destroyed" | "damaged";
	note?: string;
}

export type PurchaseType = {
	id: Prefix<'PUR-'>;
	supplierId: SupplierType['id'];
	
	orders: {
		products: PurchaseProduct[];
		status: "pending" | 'completed';
	},
	
	returns?: {
		products: PurchaseReturn[];
		status: "pending" | 'completed';
	},

	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
}