// app/admin/printer-view/page.tsx
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default function PrinterView() {
	let lines: string[] = [];

	try {
		// 1. Get the path to the .bin file in your root directory
		const filePath = path.join(process.cwd(), 'receipt-test.bin');

		// 2. Read the file
		if (fs.existsSync(filePath)) {
			const buffer = fs.readFileSync(filePath);
			const rawOutput = buffer.toString('utf-8');

			// 3. Clean ESC/POS control characters
			lines = rawOutput
				.replace(/[\x1b\x1d][\x00-\x7f][\x00-\x7f]?/g, '')
				.split('\n');
		}
	} catch (error) {
		console.error("Failed to read receipt-test.bin:", error);
	}

	return (
		<div className="flex flex-col items-center justify-start min-h-screen bg-zinc-950 p-10">
			<div className="flex items-center gap-3 mb-8">
				<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
				<h1 className="text-white font-mono text-sm uppercase tracking-widest">
					Live File Monitor (receipt-test.bin)
				</h1>
			</div>

			<div className="relative shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]">
				<div className="bg-white text-black p-8 w-[350px] min-h-[500px] font-mono text-sm relative">
					<div className="absolute top-[-12px] left-0 w-full h-4 bg-zinc-950 clip-path-zigzag" />

					<div className="space-y-1">
						{lines.length > 0 ? (
							lines.map((line, i) => (
								<pre key={i} className="whitespace-pre-wrap">{line || ' '}</pre>
							))
						) : (
							<p className="text-gray-400 text-center mt-20 italic">
								receipt-test.bin not found or empty.
							</p>
						)}
					</div>

					<div className="absolute bottom-[-12px] left-0 w-full h-4 bg-zinc-950 rotate-180 clip-path-zigzag" />
				</div>
			</div>

			<p className="mt-6 text-zinc-600 text-[10px] font-mono">
				READING FROM: {path.join(process.cwd(), 'receipt-test.bin')}
			</p>
		</div>
	);
}