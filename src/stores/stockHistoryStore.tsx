"use client"

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

import { StockHistoryType } from '@/types/StockHistoryTypes';
import { create } from 'zustand';
import { db } from '@/libs/firebaseClientConfig';
import { useEffect } from 'react';

export type StockHistoryStoreState = {
	histories: StockHistoryType[];
	setHistories: (histories: StockHistoryType[]) => void;
}

export const stockHistoryStore = create<StockHistoryStoreState>((set) => ({
	histories: [],
	setHistories: (histories: StockHistoryType[]) => set({histories})
}));

export function useStockHistory() {
	const { histories, setHistories } = stockHistoryStore.getState();

	useEffect(() => {
		// 1. Create a query to get history sorted by creation time (Newest first)
		const q = query(
			collection(db, "stock-history"),
			orderBy("createdAt", "desc")
		);

		// 2. Listen for real-time changes
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const historyList = snapshot.docs.map(doc => ({
				...doc.data()
			} as StockHistoryType));

			setHistories(historyList);
		}, (error) => {
			console.error("Error fetching stock history:", error);
		});

		// 3. Clean up the listener when the provider unmounts
		return () => unsubscribe();
	}, [setHistories]);

	return histories;
}