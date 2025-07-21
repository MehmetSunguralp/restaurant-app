import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	try {
		const categories = await prisma.category.findMany();
		return NextResponse.json({ categories });
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const { name } = await req.json();
		if (!name) {
			return NextResponse.json({ error: "Name is required" }, { status: 400 });
		}
		const category = await prisma.category.create({ data: { name } });
		return NextResponse.json(category);
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");
		if (!id) {
			return NextResponse.json({ error: "Category id is required" }, { status: 400 });
		}
		await prisma.category.delete({ where: { id } });
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
