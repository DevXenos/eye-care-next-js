"use client";
import { useEffect, useRef } from "react"

export default function BarCodeForm({onScanAction}: {onScanAction?: (code: string) => Promise<void> | void}) {
	// We use a ref for the buffer so it doesn't trigger re-renders 
	// for every single character scanned (which happens in milliseconds)
	const scanBuffer = useRef<string>("");

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// 1. If the scanner hits ENTER, the scan is complete
			if (event.key === 'Enter') {
				if (scanBuffer.current.length > 0) {
					const finalCode = scanBuffer.current;

					onScanAction?.(finalCode);

					// Clear the buffer for the next scan
					scanBuffer.current = "";
				}
				return;
			}

			// 2. Ignore non-character keys (Shift, Alt, etc.)
			if (event.key?.length > 1) return;

			// 3. Append the character to our buffer
			scanBuffer.current += event.key;

			// 4. Safety Timeout: If someone types manually and stops, 
			// clear the buffer after 200ms so the next scan starts fresh.
			// Scanners usually type all chars in < 50ms.
			setTimeout(() => {
				// This is optional but helps prevent "dirty" data
			}, 200);
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// This component remains invisible as a "Global Listener"
	return null;
}