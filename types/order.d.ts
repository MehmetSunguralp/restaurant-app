import type { Product } from "./product";

export type OrderItem = {
	id: string;
	orderId: string;
	productId: string;
	product: Product;
	quantity: number;
	price: number;
};

export type Order = {
	id: string;
	userId?: string;
	items: OrderItem[];
	total: number;
	status: string;
	createdAt: string;
};
