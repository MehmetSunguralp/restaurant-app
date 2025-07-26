import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState } from "@/types/cart";

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addToCart: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.productId === item.productId);
                    if (existing) {
                        const newQuantity = existing.quantity + item.quantity;
                        if (newQuantity <= 0) {
                            return {
                                items: state.items.filter((i) => i.productId !== item.productId),
                            };
                        }
                        return {
                            items: state.items.map((i) =>
                                i.productId === item.productId ? { ...i, quantity: newQuantity } : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),
            removeFromCart: (productId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.productId !== productId),
                })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: "cart-storage", // Key for localStorage
        }
    )
);
