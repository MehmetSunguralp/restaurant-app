import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { email, newPassword } = await req.json();

	if (!email || !newPassword) {
		return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
	}

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
	}

	const hashed = await hash(newPassword, 10);

	await prisma.user.update({
		where: { email },
		data: { password: hashed },
	});

	await prisma.passwordResetRequest.deleteMany({ where: { email } });

	return NextResponse.json({ success: true });
}
