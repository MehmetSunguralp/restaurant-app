import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const take = parseInt(searchParams.get("take") || "10", 10);
	const cursor = searchParams.get("cursor");
	const userId = searchParams.get("userId");

	const where = userId ? { userId } : {};

	const orders = await prisma.order.findMany({
		where,
		take,
		...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
		orderBy: { createdAt: "desc" },
		include: { items: { include: { product: true } }, user: true },
	});

	let nextCursor = null;
	if (orders.length === take) {
		nextCursor = orders[orders.length - 1].id;
	}

	return NextResponse.json({ orders, nextCursor });
}
