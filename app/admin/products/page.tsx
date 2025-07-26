import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminProducts from "@/components/AdminProducts";

export default async function AdminProductsPage() {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "ADMIN") {
		redirect("/unauthorized"); // veya 404 gösterebilirsiniz
	}

	return <AdminProducts />;
}
