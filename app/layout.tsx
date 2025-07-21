import type { ReactNode } from "react";
import NextTopLoader from "nextjs-toploader";
import "../styles/globals.scss";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
			</head>
			<body style={{ fontFamily: "Inter, Arial, sans-serif" }}>
				<NextTopLoader showSpinner={false} height={10} />
				<nav>
					<ul>
						<li>
							<Link href="/admin/products">Admin Products</Link>
						</li>
					</ul>
				</nav>
				{children}
			</body>
		</html>
	);
}
