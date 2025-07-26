import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { useState } from "react";

type Props = {
	name?: string;
	surname?: string;
	email?: string;
};

export const useCheckSession = () => {
	const [session, setSession] = useState<Props>();
	const checkSession = async () => {
		const serverSession = await getServerSession(authOptions);
		console.log(serverSession);
		const user = serverSession?.user;
		if (user)
			setSession({
				name: user.name,
				surname: user.surname,
				email: user.email,
			});
	};
	return session;
};
