import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { email, code } = await req.json();

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user || !user.emailVerifyCode || !user.emailVerifyExpires) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	if (user.isVerified) {
		return NextResponse.json({ error: "Already verified" }, { status: 400 });
	}

	if (user.emailVerifyCode !== code) {
		return NextResponse.json({ error: "Invalid code" }, { status: 400 });
	}

	if (user.emailVerifyExpires < new Date()) {
		return NextResponse.json({ error: "Code expired" }, { status: 400 });
	}

	await prisma.user.update({
		where: { email },
		data: {
			isVerified: true,
			emailVerifyCode: null,
			emailVerifyExpires: null,
		},
	});

	return NextResponse.json({ message: "Verified" }, { status: 200 });
}
