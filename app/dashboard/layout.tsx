export const dynamic = "force-dynamic"

import { AdminAccount } from "@/types/AdminAccountTypes";
import { AdminAccountProvider } from "@/stores/currentUserStore"
import { COOKIES } from "@/constants/keys";
import admin from "@/libs/firebaseAdminConfig";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export default async function AdminServerLayout({children}: LayoutProps<"/dashboard">) {

	const cookiesStore = await cookies();
	const sessionToken = cookiesStore.get(COOKIES.AUTH_SESSION);

	if (!sessionToken) {
		return redirect('/');
	}

	const verify = async () => {
		try {
			const decoded = await admin.auth().verifySessionCookie(sessionToken.value);

			return decoded;
		}catch {
			return null;
		}
	}

	const decoded = await verify();

	if (!decoded) return redirect("/");

	const currentAdmin: AdminAccount = {
		uid: `${decoded.uid}`,
		email: `${decoded.email}`
	}

	return (
		<AdminAccountProvider currentAdmin={currentAdmin}>
			{children}
		</AdminAccountProvider>
	)
}