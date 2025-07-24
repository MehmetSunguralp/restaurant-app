import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const { email, code } = await req.json();

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user || !user.emailVerifyCode || !user.emailVerifyExpires) {
		return new Response("Invalid request", { status: 400 });
	}

	if (user.isVerified) {
		return new Response("Already verified", { status: 400 });
	}

	if (user.emailVerifyCode !== code) {
		return new Response("Invalid code", { status: 400 });
	}

	if (user.emailVerifyExpires < new Date()) {
		return new Response("Code expired", { status: 400 });
	}

	await prisma.user.update({
		where: { email },
		data: {
			isVerified: true,
			emailVerifyCode: null,
			emailVerifyExpires: null,
		},
	});

	return new Response("Verified", { status: 200 });
}
