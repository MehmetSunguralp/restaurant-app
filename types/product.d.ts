export type Product = {
	id: string;
	name: string;
	description?: string;
	price: number;
	imageUrl?: string;
	category: Category;
	categoryId: string;
	availability: boolean;
};

export type Category = {
	id: string;
	name: string;
};
