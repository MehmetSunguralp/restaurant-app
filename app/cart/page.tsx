"use client";
import { useCartStore } from "@/store/cart";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";

import styles from "../../styles/components/Cart.module.scss";
import Swal from "sweetalert2";

export default function CartPage() {
	const { items, removeFromCart } = useCartStore((state) => ({
		items: state.items,
		removeFromCart: state.removeFromCart,
	}));

	const handleRemove = async (productId) => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to remove this product from the cart?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, remove it!",
		});
		if (!result.isConfirmed) return;
		removeFromCart(productId);
	};

	return (
		<>
			<Navbar />
			<main className={styles.cart}>
				<h1>Your Cart</h1>
				{items.length === 0 ? (
					<p>Your cart is empty.</p>
				) : (
					<>
						<div className={styles.items}>
							{items.map((item) => (
								<CartItem key={item.productId} item={item} onRemove={handleRemove} />
							))}
						</div>
						<CartSummary />
					</>
				)}
			</main>
			<Footer />
		</>
	);
}
