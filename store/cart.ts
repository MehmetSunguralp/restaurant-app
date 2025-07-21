import { create } from "zustand";
import type { CartItem, CartState } from "@/types/cart";

export const useCartStore = create<CartState>((set) => ({
	items: [],
	addToCart: (item) =>
		set((state) => {
			const existing = state.items.find((i) => i.productId === item.productId);
			if (existing) {
				return {
					items: state.items.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i)),
				};
			}
			return { items: [...state.items, item] };
		}),
	removeFromCart: (productId) =>
		set((state) => ({
			items: state.items.filter((i) => i.productId !== productId),
		})),
	clearCart: () => set({ items: [] }),
}));
