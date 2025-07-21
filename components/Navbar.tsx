"use client";
import { useCartStore } from "@/store/cart";

import Link from "next/link";

import styles from "../styles/components/Navbar.module.scss";

export default function Navbar() {
	const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
	return (
		<nav className={styles.navbar}>
			<div className={styles.logo}>
				<Link href="/">Gourmet Haven</Link>
			</div>
			<ul className={styles.links}>
				<li>
					<Link href="/">Home</Link>
				</li>
				<li>
					<Link href="/menu">Menu</Link>
				</li>
				<li>
					<Link href="/about">About</Link>
				</li>
				<li>
					<Link href="/cart">Cart{itemCount > 0 && <span className={styles.cartCount}>{itemCount}</span>}</Link>
				</li>
			</ul>
		</nav>
	);
}
