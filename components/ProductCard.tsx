import { useCartStore } from "@/store/cart";

import type { Product } from "@/types/product";

import styles from "../styles/components/ProductCard.module.scss";

type Props = {
	product: Product;
};

export default function ProductCard({ product }: Props) {
	const addToCart = useCartStore((state) => state.addToCart);
	const removeFromCart = useCartStore((state) => state.removeFromCart);
	const cartItem = useCartStore((state) => state.items.find((i) => i.productId === product.id));
	return (
		<div className={styles.card}>
			{product.imageUrl && <img src={product.imageUrl} alt={product.name} className={styles.image} />}
			<h3>{product.name}</h3>
			<p className={styles.desc}>{product.description}</p>
			<div className={styles.bottom}>
				<span className={styles.price}>${product.price.toFixed(2)}</span>
				{!cartItem || cartItem.quantity === 0 ? (
					<button
						className={styles.addBtn}
						onClick={() =>
							addToCart({
								productId: product.id,
								name: product.name,
								price: product.price,
								quantity: 1,
								imageUrl: product.imageUrl,
							})
						}
					>
						Add to Cart
					</button>
				) : (
					<div className={styles.qtyControls}>
						<button className={styles.qtyBtn} onClick={() => addToCart({ ...cartItem, quantity: -1 })}>
							-
						</button>
						<span className={styles.qty}>{cartItem.quantity}</span>
						<button className={styles.qtyBtn} onClick={() => addToCart({ ...cartItem, quantity: 1 })}>
							+
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
