import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignupPageClient from "@/components/SignUpPageClient";

export default async function SignupPage() {
	const session = await getServerSession(authOptions);

	return <SignupPageClient session={session} />;
}
