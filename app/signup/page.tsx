import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignupPageClient from "@/components/SignUpPageClient";
import { redirect } from "next/navigation";

export default async function SignupPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		window.location.href = "/menu";
	}

	return <SignupPageClient session={session} />;
}
