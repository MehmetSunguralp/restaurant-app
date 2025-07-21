"use client";
import { useCartStore } from "@/store/cart";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";

import styles from "../../styles/components/Cart.module.scss";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
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
                <CartItem key={item.productId} item={item} />
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