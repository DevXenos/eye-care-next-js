import "client-only"

import { collection, onSnapshot, query } from "firebase/firestore";

import { ProductType } from "@/types/ProductTypes"
import { create } from "zustand";
import { db } from "@/libs/firebaseClientConfig";
import { useEffect } from "react";

export type ProductStoreState = {
	products: ProductType[];
	categories: string[];
	brands: string[];
	setProducts: (products: ProductType[]) => void,
	getProductById: (id: ProductType['id']) => ProductType | undefined;
}

export const productStore = create<ProductStoreState>((set, get) => ({
	products: [],
	categories: [],
	brands: [],
	setProducts: (products) => {
		const uniqueCategories = new Set(
			products
				.map((p) => p.category)
				.filter((cat): cat is string => !!cat) // Remove null/undefined
		);
		// return [...Array.from(uniqueCategories)];

		const uniqueBrands = new Set(
			products
				.map((p) => p.brand)
				.filter((cat): cat is string => !!cat)
		);

		set({
			products,
			categories: Array.from(uniqueCategories),
			brands: Array.from(uniqueBrands),
		});
	},
	getProductById: (id) => {
		return get().products.find((p) => p.id === id);
	}
}))

export function useProducts() {
	const setProducts = productStore((s) => s.setProducts);
	const brands = productStore((s) => s.brands);
	const categories = productStore((s) => s.categories);
	const getProductById = productStore((s) => s.getProductById);
	const products = productStore((s) => s.products);

	useEffect(() => {
		const q = query(collection(db, "products"));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const productList: ProductType[] = snapshot.docs.map((doc) => ({
				// ...(doc.data() as Omit<ProductType, "id">),
				...(doc.data() as ProductType),
			}));

			setProducts(productList);
		});
		return () => unsubscribe();
	}, [setProducts]);

	return { brands, categories, getProductById, products };
}