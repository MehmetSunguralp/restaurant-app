"use client";

import Link from "next/link";
import styles from "../styles/components/Navbar.module.scss";
import { useCartStore } from "@/store/cart";
import { Session } from "next-auth";

type Props = {
	session: Session | null;
};

export default function Navbar({ session }: Props) {
	const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
	const isLoggedIn = !!session?.user;
	console.log("session:", session);

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

				{isLoggedIn ? (
					<li>
						<Link href="/profile">Profile</Link>
					</li>
				) : (
					<>
						<li>
							<Link href="/signin">Sign In</Link>
						</li>
						<li>
							<Link href="/signup">Sign Up</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
}
