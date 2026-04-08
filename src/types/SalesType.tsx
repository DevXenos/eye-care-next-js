import { CartType } from "./POSTypes";
import { CreatedAt, Prefix } from "./UtilsType";

export type SalesType = {
	id: Prefix<"SL-">;
	customerName: string;

	carts: CartType[];

	totalAmount: number;

	createdAt: CreatedAt;
};