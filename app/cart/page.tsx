"use client";
import { useCartStore } from "@/store/cart";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import Skeleton from "@/components/Skeleton";

import styles from "../../styles/components/Cart.module.scss";
import Swal from "sweetalert2";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
	const { items, removeFromCart } = useCartStore((state) => ({
		items: state.items,
		removeFromCart: state.removeFromCart,
	}));

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		// Simulate loading for demo, or set loading false after fetching cart items
		setTimeout(() => setLoading(false), 500);
	}, []);

	const handleRemove = async (productId: string) => {
		const result = await Swal.fire({
			title: "Emin misiniz?",
			text: "Bu ürünü sepetten çıkarmak istiyor musunuz?",
			icon: "warning",
			showCancelButton: true,
			cancelButtonText: "Hayır",
			confirmButtonText: "Evet",
		});
		if (!result.isConfirmed) return;
		removeFromCart(productId);
	};

	return (
		<>
			<main className={styles.cart}>
				<div
					style={{
						background: "rgba(255,255,255,0.92)",
						borderRadius: 16,
						boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
						padding: 32,
						margin: "0 auto",
						maxWidth: 800,
					}}
				>
					<h1>Sepetiniz</h1>
					{items.length === 0 ? (
						<>
							<p>Sepetinizde ürün yok.</p>
							<Link href="/menu" className={styles.menuBtn}>
								Menüye Git
							</Link>
						</>
					) : (
						<>
							<div className={styles.items}>
								{loading
									? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={80} style={{ marginBottom: 16 }} />)
									: items.map((item) => <CartItem key={item.productId} item={item} onRemove={handleRemove} />)}
							</div>
							<CartSummary />
						</>
					)}
				</div>
			</main>
		</>
	);
}
