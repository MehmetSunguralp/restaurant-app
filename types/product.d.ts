export type Product = {
	id: string;
	name: string;
	description?: string;
	price: number;
	imageUrl?: string;
	categoryId: string;
	category?: Category;
};

export type Category = {
	id: string;
	name: string;
};
