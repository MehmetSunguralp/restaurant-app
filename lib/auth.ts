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
				else {
					const isExistingUser = await prisma.user.findUnique({
						where: { email: credentials.email },
					});
					if (!isExistingUser) return null;
					const isPasswordValid = await compare(credentials.password, isExistingUser.password);
					if (!isPasswordValid) return null;
					return {
						id: isExistingUser.id,
						name: isExistingUser.name,
						surname: isExistingUser.surname,
						email: isExistingUser.email,
					};
				}
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
				},
			};
		},
		async jwt({ token, user }) {
			if (user) {
				return {
					...token,
					name: user.name,
					surname: user.surname, // This is coming from authorize()
					email: user.email,
				};
			}
			return token;
		},
	},
};
