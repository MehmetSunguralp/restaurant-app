import { useCartStore } from "@/store/cart";

import styles from "../styles/components/CartSummary.module.scss";

export default function CartSummary() {
	const items = useCartStore((state) => state.items);
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	return (
		<div className={styles.summary}>
			<h3>Order Summary</h3>
			<div className={styles.total}>Total: ₺{total.toFixed(2)}</div>
			<button className={styles.checkoutBtn}>Proceed to Checkout</button>
		</div>
	);
}
