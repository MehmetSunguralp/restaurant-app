export type CartItem = {
	productId: string;
	name: string;
	price: number;
	quantity: number;
	imageUrl?: string;
};

export type CartState = {
	items: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (productId: string) => void;
	clearCart: () => void;
};
