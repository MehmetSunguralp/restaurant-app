"use client";

import Link from "next/link";
import styles from "../styles/components/Navbar.module.scss";
import { useCartStore } from "@/store/cart";
import { Session } from "next-auth";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

type Props = {
	session: Session | null;
};

export default function Navbar({ session }: Props) {
	const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
	const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
	const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
	const role = useAuthStore((state) => state.role);
	const isAdmin = role === "ADMIN";

	useEffect(() => {
		if (!!session?.user) {
			setAuthDetails(session.user.email, session.user.role);
		} else {
			setIsLoggedIn(false);
			setAuthDetails(null, "USER");
		}
		console.log(session)
	}, [session]);

	return (
		<nav className={styles.navbar}>
			<div className={styles.logo}>
				<Link href="/">Gourmet Haven</Link>
			</div>
			<ul className={styles.links}>
				<li>
					<Link href="/">Anasayfa</Link>
				</li>
				<li>
					<Link href="/menu">Menü</Link>
				</li>
				{!isAdmin && (
					<>
						<li>
							<Link href="/about">Hakkında</Link>
						</li>

						<li>
							<Link href="/cart">Sepet{itemCount > 0 && <span className={styles.cartCount}>{itemCount}</span>}</Link>
						</li>
					</>
				)}
				{isAdmin && (
					<li>
						<Link href="/admin/products">Ürün Yönetimi</Link>
					</li>
				)}

				{isLoggedIn ? (
					<li>
						<Link href="/profile">Hesap</Link>
					</li>
				) : (
					<>
						<li>
							<Link href="/signin">Giriş Yap</Link>
						</li>
						<li>
							<Link href="/signup">Kayıt Ol</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
}
