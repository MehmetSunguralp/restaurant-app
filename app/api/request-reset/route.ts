// /app/api/auth/request-reset/route.ts
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import { verificationEmailTemplate } from "@/utils/emailTemplates";
import { randomInt } from "crypto";

export async function POST(req: Request) {
	const { email } = await req.json();

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

	const code = randomInt(100000, 999999).toString();
	const expires = new Date(Date.now() + 1000 * 60 * 10);

	await prisma.passwordResetRequest.create({
		data: { email, code, expiresAt: expires },
	});

	await resend.emails.send({
		from: "Restaurant App <onboarding@resend.dev>",
		to: email,
		subject: `Şifre Sıfırlama Doğrulama Kodu | ${code} | Restaurant App`,
		html: verificationEmailTemplate(code, "Kayıt işleminizi tamamlamak için aşağıdaki doğrulama kodunu kullanın:"),
	});

	return NextResponse.json({ success: true });
}
