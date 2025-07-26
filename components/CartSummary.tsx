import { useCartStore } from "@/store/cart";

import styles from "../styles/components/CartSummary.module.scss";
import { useRouter } from "next/navigation";

export default function CartSummary() {
	const items = useCartStore((state) => state.items);
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const router = useRouter();
	return (
		<div className={styles.summary}>
			<h3>Sipariş Özeti</h3>
			<div className={styles.total}>Toplam Tutar: ₺{total.toFixed(2)}</div>
			<button onClick={() => router.push("/payment")} className={styles.checkoutBtn}>
				Ödemeye Geç
			</button>
		</div>
	);
}
