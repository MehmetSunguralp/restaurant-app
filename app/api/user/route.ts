import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

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

		const hashedPassword = await hash(password, 10);
		const newUser = await prisma.user.create({
			data: {
				name,
				surname,
				password: hashedPassword,
				email,
			},
		});
        const {password: newUserPassword, ...rest} = newUser;
		return NextResponse.json({ user: rest, message: "Kullanıcı başarıyla oluşturuldu" }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Bir sorun oluştu" }, { status: 500 });
	}
}
