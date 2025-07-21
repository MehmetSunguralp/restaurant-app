import { useCartStore } from "@/store/cart";
import type { CartItem } from "@/types/cart";

import styles from "../styles/components/CartItem.module.scss";

type Props = {
	item: CartItem;
};

export default function CartItem({ item }: Props) {
	const removeFromCart = useCartStore((state) => state.removeFromCart);
	const addToCart = useCartStore((state) => state.addToCart);
	return (
		<div className={styles.cartItem}>
			{item.imageUrl && <img src={item.imageUrl} alt={item.name} className={styles.image} />}
			<div className={styles.info}>
				<h4>{item.name}</h4>
				<div className={styles.controls}>
					<button onClick={() => addToCart({ ...item, quantity: -1 })}>-</button>
					<span>{item.quantity}</span>
					<button onClick={() => addToCart({ ...item, quantity: 1 })}>+</button>
					<button className={styles.remove} onClick={() => removeFromCart(item.productId)}>
						Remove
					</button>
				</div>
			</div>
			<div className={styles.price}>${(item.price * item.quantity).toFixed(2)}</div>
		</div>
	);
}
