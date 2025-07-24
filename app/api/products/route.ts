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
		return NextResponse.json({ error: "Sunucu Hatası" }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		const { id, name, description, price, imageUrl, categoryId, availability } = body;
		if (!id) {
			return NextResponse.json({ error: "Product id is required" }, { status: 400 });
		}
		const updated = await prisma.product.update({
			where: { id },
			data: { name, description, price, imageUrl, categoryId, availability },
		});
		return NextResponse.json(updated);
	} catch (error) {
		console.error("API PUT /products error:", error);
		return NextResponse.json({ error: "Sunucu Hatası" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");
		if (!id) {
			return NextResponse.json({ error: "Product id is required" }, { status: 400 });
		}
		await prisma.product.delete({ where: { id } });
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("API DELETE /products error:", error);
		return NextResponse.json({ error: "Sunucu Hatası" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { name, description, price, imageUrl, categoryId, availability } = body;
		if (!name || !categoryId || price === undefined) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}
		const created = await prisma.product.create({
			data: { name, description, price, imageUrl, categoryId, availability },
		});
		return NextResponse.json(created);
	} catch (error) {
		console.error("API POST /products error:", error);
		return NextResponse.json({ error: "Sunucu Hatası" }, { status: 500 });
	}
}
