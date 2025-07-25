import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { hash } from "bcrypt";
import { randomInt } from "crypto";
import { verificationEmailTemplate } from "@/utils/emailTemplates";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, surname, password, email } = body || {};

		if (!name || !surname || !email || !password) {
			return NextResponse.json({ error: "Lütfen eksik alanları doldurun" }, { status: 400 });
		}

		const isExistingUserByEmail = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (isExistingUserByEmail) {
			return NextResponse.json({ user: null, error: "Bu email adresi zaten kullanılıyor" }, { status: 409 });
		}

		const code = String(randomInt(100000, 999999));
		const hashedPassword = await hash(password, 10);
		const newUser = await prisma.user.create({
			data: {
				name,
				surname,
				password: hashedPassword,
				email,
				emailVerifyCode: code,
				emailVerifyExpires: new Date(Date.now() + 10 * 60 * 1000),
			},
		});
		await resend.emails.send({
			from: "Restaurant App <onboarding@resend.dev>",
			to: email,
			subject: `E-Posta Doğrulama Kodu | ${code} | Restaurant App`,
			html: verificationEmailTemplate(code, "Kayıt işleminizi tamamlamak için aşağıdaki doğrulama kodunu kullanın:"),
		});

		const { password: newUserPassword, ...rest } = newUser;
		return NextResponse.json({ user: rest, message: "Kullanıcı başarıyla oluşturuldu" }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Bir sorun oluştu" }, { status: 500 });
	}
}



