import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const take = parseInt(searchParams.get("take") || "10", 10);
		const cursor = searchParams.get("cursor");
		const category = searchParams.get("category");

		const where = category ? { category: { name: category } } : {};

		const products = await prisma.product.findMany({
			where,
			take,
			...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
			orderBy: { name: "asc" },
			include: { category: true },
		});

		let nextCursor = null;
		if (products.length === take) {
			nextCursor = products[products.length - 1].id;
		}

		return NextResponse.json({ products, nextCursor });
	} catch (error) {
		console.error("API GET /products error:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
