import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
	const { code } = await req.json();

	if (!code) {
		return NextResponse.json("Kod gerekli", { status: 400 });
	}

	const user = await prisma.passwordResetRequest.findFirst({
		where: { code: code },
	});

	if (!user) {
		return NextResponse.json("Kod geçersiz veya süresi dolmuş", { status: 400 });
	}

	return NextResponse.json({ email: user.email });
}
