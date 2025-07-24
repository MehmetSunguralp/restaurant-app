import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignInPageClient from "@/components/SignInPageClient";
import { redirect } from "next/navigation";

export default async function SignInPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		window.location.href = "/menu";
	}

	return <SignInPageClient session={session} />;
}
