import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import VerifyPageClient from "@/components/VerifyPageClient";
import { redirect } from "next/navigation";

export default async function VerifyPage() {
	const session = await getServerSession(authOptions);

	if (session) redirect("/menu");

	return <VerifyPageClient />;
}
