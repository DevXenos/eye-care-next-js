import { CreatedAt, Prefix, UpdatedAt } from "./UtilsType";

export type ProductType = {
	/**
	 * Internal product identifier (string), e.g., "80000001"
	 */
	id: Prefix<"PROD-">;

	/**
	 * Unique product barcode used for scanning (prefixed with "PROD-")
	 */
	barcode: string;

	/**
	 * Official product name
	 */
	name: string;

	/**
	 * Product category, e.g., "Eye drops", "Contact lenses"
	 */
	category: string;

	/**
	 * Product brand or manufacturer
	 */
	brand: string;

	/**
	 * Retail price of the product
	 */
	price: number;

	/**
	 * Current inventory count
	 */
	stockQuantity: number;

	/**
	 * Batch number, if applicable (for tracking medical batches)
	 */
	batchNumber?: string;

	/**
	 * Expiration date in ISO format (YYYY-MM-DD)
	 */
	expiryDate?: string;

	/**
	 * Timestamp when the product was created/added (ISO format)
	 */
	createdAt?: CreatedAt;

	/**
	 * Timestamp when the product was last updated (ISO format)
	 */
	updatedAt?: UpdatedAt;

	/**
	 * 
	 */
	archive?: boolean;
};

export type ProductFormData = Omit<ProductType, 'createdAt' | 'updatedAt'>;