export const dynamic = "force-dynamic";

import { COOKIES } from "@/constants/keys";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/actions/admin";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
	const cookiesStore = await cookies();

	const adminAccount = await verifySessionToken(cookiesStore.get(COOKIES.AUTH_SESSION)?.value);

	if (adminAccount) return redirect("/dashboard/overview");

	return (
		<>
			{children}
		</>
	)
}