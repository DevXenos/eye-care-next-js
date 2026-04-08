"use client";

import { useState } from "react";

/**
 * uselocalStorage hook
 * @param key localStorage key
 * @param initialValue default value (never undefined)
 * @returns [value, setValue, remove]
 */
export default function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === "undefined") return initialValue;
		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = (value: T | ((prev: T) => T)) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			console.warn(`Error setting localStorage key "${key}":`, error);
		}
	};

	const remove = () => {
		try {
			setStoredValue(initialValue); // reset to initial value instead of undefined
			if (typeof window !== "undefined") {
				window.localStorage.removeItem(key);
			}
		} catch (error) {
			console.warn(`Error removing localStorage key "${key}":`, error);
		}
	};

	return [storedValue, setValue, remove] as const;
}