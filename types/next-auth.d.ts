import NextAuth from "next-auth";

declare module "next-auth" {
	interface User {
		name: string;
		surname: string;
		email: string;
	}
	interface Session {
		user: User & {
			surname: string;
		};
		token: {
			surname: string;
		};
	}
}
