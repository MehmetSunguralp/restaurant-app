import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	// Create categories
	const categories = await prisma.category.createMany({
		data: [
			{ name: "Başlangıçlar" },
			{ name: "Ana Yemekler" },
			{ name: "Tatlılar" },
			{ name: "İçecekler" },
			{ name: "Salatalar" },
			{ name: "Çorbalar" },
		],
	});

	// Get categories
	const allCategories = await prisma.category.findMany();

	// Create products
	const productData = [
		{
			name: "Mercimek Çorbası",
			description: "Kırmızı mercimekten yapılan geleneksel Türk çorbası.",
			price: 4.5,
			imageUrl: "/images/mercimek-corbasi.jpg",
			categoryId: allCategories.find((c) => c.name === "Çorbalar")?.id || "",
			availability: true,
		},
		{
			name: "Ezogelin Çorbası",
			description: "Bulgur, mercimek ve baharatlarla yapılan nefis çorba.",
			price: 5.0,
			imageUrl: "/images/ezogelin-corbasi.jpg",
			categoryId: allCategories.find((c) => c.name === "Çorbalar")?.id || "",
			availability: true,
		},
		{
			name: "Kebap",
			description: "Közde pişmiş et ve sebzelerle servis edilen kebap.",
			price: 18.0,
			imageUrl: "/images/kebap.jpg",
			categoryId: allCategories.find((c) => c.name === "Ana Yemekler")?.id || "",
			availability: true,
		},
		{
			name: "İskender",
			description: "Yoğurt, tereyağı ve domates soslu döner.",
			price: 20.0,
			imageUrl: "/images/iskender.jpg",
			categoryId: allCategories.find((c) => c.name === "Ana Yemekler")?.id || "",
			availability: true,
		},
		{
			name: "Lahmacun",
			description: "İnce hamur üzerinde baharatlı kıyma.",
			price: 7.0,
			imageUrl: "/images/lahmacun.jpg",
			categoryId: allCategories.find((c) => c.name === "Ana Yemekler")?.id || "",
			availability: true,
		},
		{
			name: "Baklava",
			description: "Cevizli ve şerbetli geleneksel Türk tatlısı.",
			price: 6.0,
			imageUrl: "/images/baklava.jpg",
			categoryId: allCategories.find((c) => c.name === "Tatlılar")?.id || "",
			availability: true,
		},
		{
			name: "Künefe",
			description: "Peynirli ve şerbetli sıcak tatlı.",
			price: 8.0,
			imageUrl: "/images/kunefe.jpg",
			categoryId: allCategories.find((c) => c.name === "Tatlılar")?.id || "",
			availability: true,
		},
		{
			name: "Ayran",
			description: "Yoğurt, su ve tuz karışımı serinletici içecek.",
			price: 2.5,
			imageUrl: "/images/ayran.jpg",
			categoryId: allCategories.find((c) => c.name === "İçecekler")?.id || "",
			availability: true,
		},
		{
			name: "Şalgam",
			description: "Acılı veya acısız, turpgillerden yapılan içecek.",
			price: 3.0,
			imageUrl: "/images/salgam.jpg",
			categoryId: allCategories.find((c) => c.name === "İçecekler")?.id || "",
			availability: true,
		},
		{
			name: "Çoban Salata",
			description: "Domates, salatalık, biber ve soğan ile yapılan taze salata.",
			price: 5.0,
			imageUrl: "/images/coban-salata.jpg",
			categoryId: allCategories.find((c) => c.name === "Salatalar")?.id || "",
			availability: true,
		},
	];
	for (const data of productData) {
		await prisma.product.create({ data });
	}

	// Create a test user
	const password = await bcrypt.hash("password123", 10);
	await prisma.user.upsert({
		where: { email: "test@example.com" },
		update: {},
		create: {
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
