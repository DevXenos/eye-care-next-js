import { CreatedAt, Prefix, UpdatedAt } from "./UtilsType";

export type SupplierType = {
	id: Prefix<"SUP-">;
	name: string;
	address: string;
	contacts: string[];        // Email(s) or phone number(s)
	website?: string;          // Optional supplier website
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;     // Optional, if never updated
	archive?: boolean;
};