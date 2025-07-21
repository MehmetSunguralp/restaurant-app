import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	// Create categories
	const categories = await prisma.category.createMany({
		data: [{ name: "Starters" }, { name: "Main Courses" }, { name: "Desserts" }, { name: "Drinks" }],
	});

	// Get categories
	const allCategories = await prisma.category.findMany();

	// Create products
	await prisma.product.createMany({
		data: [
			{
				name: "Tomato Soup",
				description: "Fresh tomato soup with basil",
				price: 5.99,
				imageUrl: "/images/tomato-soup.jpg",
				categoryId: allCategories.find((c) => c.name === "Starters")?.id || "",
			},
			{
				name: "Grilled Chicken",
				description: "Served with vegetables",
				price: 12.99,
				imageUrl: "/images/grilled-chicken.jpg",
				categoryId: allCategories.find((c) => c.name === "Main Courses")?.id || "",
			},
			{
				name: "Chocolate Cake",
				description: "Rich chocolate cake",
				price: 6.5,
				imageUrl: "/images/chocolate-cake.jpg",
				categoryId: allCategories.find((c) => c.name === "Desserts")?.id || "",
			},
			{
				name: "Lemonade",
				description: "Freshly squeezed lemonade",
				price: 3.0,
				imageUrl: "/images/lemonade.jpg",
				categoryId: allCategories.find((c) => c.name === "Drinks")?.id || "",
			},
		],
	});

	// Create a test user
	const password = await bcrypt.hash("password123", 10);
	await prisma.user.create({
		data: {
			email: "test@example.com",
			password,
			name: "Test User",
		},
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
