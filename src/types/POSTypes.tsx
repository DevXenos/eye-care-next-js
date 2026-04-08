import { ProductType } from "./ProductTypes";

// Each cart item stores:
// - Product info at the time of sale (name, price)
// - Quantity sold
// - Optional subtotal for convenience
export type CartType = {
	productId: ProductType['id']; // reference to product
	name: ProductType['name'];    // store product name at time of sale
	price: ProductType['price'];  // store product price at time of sale
	quantity: number;             // number of items sold
	subtotal?: number;            // price * quantity (optional, can calculate dynamically)
};