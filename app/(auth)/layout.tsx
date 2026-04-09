import { redirect } from "next/navigation";
import { verifySessionToken } from "@/actions/admin";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
	
	const adminAccount = await verifySessionToken();

	if (adminAccount) return redirect("/dashboard/overview");

	return (
		<>
			{children}
		</>
	)
}