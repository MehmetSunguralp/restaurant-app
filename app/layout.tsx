import type { ReactNode } from "react";
import Link from "next/link";

import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import "../styles/globals.scss";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
			</head>
			<body style={{ fontFamily: "Inter, Arial, sans-serif" }}>
				<Navbar />
				<NextTopLoader showSpinner={false} height={10} />
				{children}
				<Footer />
			</body>
		</html>
	);
}
