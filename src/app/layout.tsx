import type { Metadata, Viewport } from "next";

import ClientProviders from "@/providers/ClientProviders";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
}

export const metadata: Metadata = {
	title: "Eye Care - Professional Vision & Eye Health Services",
	description: "Eye Care Web: Track, manage, and improve eye health with our professional vision care services. Built with Next.js and MUI.",
	keywords: ["eye care", "vision health", "optometry", "eye clinic", "eye health management"],
	authors: [{ name: "Your Company Name" }],
	// viewport: "width=device-width, initial-scale=1",
	openGraph: {
		title: "Eye Care - Professional Vision & Eye Health Services",
		description: "Track and manage eye health easily with our professional web platform.",
		url: process.env.NEXT_PUBLIC_DOMAIN,
		siteName: "Eye Care Web",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Eye Care Web Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Eye Care - Professional Vision & Eye Health Services",
		description: "Track and manage eye health easily with our professional web platform.",
		images: ["/og-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>
				<ClientProviders>
					{children}
				</ClientProviders>
			</body>
		</html>
	);
}
