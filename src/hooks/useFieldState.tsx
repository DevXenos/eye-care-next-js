"use client";

import { useCallback, useEffect, useState } from "react";

export default function useFieldState<T extends Record<string, unknown>>(def: T) {
	const [data, setData] = useState<T>(def);

	// only reset when def actually changes
	useEffect(() => {
		setData(def);
	}, [def]);

	const setField = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			setData((prev) => ({
				...prev,
				[key]: value,
			}));
		},
		[]
	);

	const reset = useCallback(() => {
		setData(def);
	}, [def]);

	return [data, setField, reset, setData] as const;
}