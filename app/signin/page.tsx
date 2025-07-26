import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignInPageClient from "@/components/SignInPageClient";

export default async function SignInPage() {
	const session = await getServerSession(authOptions);

	return <SignInPageClient session={session} />;
}
