// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Profile from "@/components/Profile";

export default async function ProfilePage() {
	const session = await getServerSession(authOptions);
    console.log(session)
	const user = session?.user;

	return (
		<Profile
			name={user?.name}
			surname={user?.surname}
			email={user?.email}
			role={user?.role}
		/>
	);
}
