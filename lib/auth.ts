import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/signin",
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "Email Adresiniz" },
				password: { label: "Şifre", type: "password", placeholder: "Şifreniz" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user) {
					throw new Error("Böyle bir e-posta bulunamadı.");
				}

				if (!user.isVerified) {
					throw new Error("Lütfen e-posta adresinizi doğrulayın.");
				}

				const isPasswordValid = await compare(credentials.password, user.password);
				if (!isPasswordValid) {
					throw new Error("Şifre yanlış.");
				}

				return {
					id: user.id,
					name: user.name,
					surname: user.surname,
					email: user.email,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		async session({ session, user, token }) {
			return {
				...session,
				user: {
					...session.user,
					name: token.name,
					surname: token.surname,
					email: token.email,
					role: token.role,
				},
			};
		},
		async jwt({ token, user }) {
			if (user) {
				return {
					...token,
					name: user.name,
					surname: user.surname,
					email: user.email,
					role: user.role,
				};
			}
			return token;
		},
	},
};
