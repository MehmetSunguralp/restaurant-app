import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json({ error: "E-posta ve şifre gereklidir." }, { status: 400 });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json({ error: "Bu e-postaya ait bir kullanıcı bulunamadı." }, { status: 404 });
		}

		if (user.role === "ADMIN") {
			return NextResponse.json({ error: "Admin hesabı silinemez." }, { status: 403 });
		}

		const isPasswordValid = await compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json({ error: "Şifre yanlış." }, { status: 401 });
		}

		await prisma.user.delete({ where: { email } });

		return NextResponse.json({ message: "Kullanıcı başarıyla silindi." }, { status: 200 });
	} catch (err) {
		console.error("Kullanıcı silme hatası:", err);
		return NextResponse.json({ error: "Sunucu hatası. Lütfen tekrar deneyin." }, { status: 500 });
	}
}
