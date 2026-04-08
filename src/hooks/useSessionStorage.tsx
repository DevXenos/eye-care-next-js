"use client";

import { useState } from "react";

/**
 * useSessionStorage hook
 * @param key sessionStorage key
 * @param initialValue default value (never undefined)
 * @returns [value, setValue, remove]
 */
export default function useSessionStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === "undefined") return initialValue;
		try {
			const item = window.sessionStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.warn(`Error reading sessionStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = (value: T | ((prev: T) => T)) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			if (typeof window !== "undefined") {
				window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			console.warn(`Error setting sessionStorage key "${key}":`, error);
		}
	};

	const remove = () => {
		try {
			setStoredValue(initialValue); // reset to initial value instead of undefined
			if (typeof window !== "undefined") {
				window.sessionStorage.removeItem(key);
			}
		} catch (error) {
			console.warn(`Error removing sessionStorage key "${key}":`, error);
		}
	};

	return [storedValue, setValue, remove] as const;
}