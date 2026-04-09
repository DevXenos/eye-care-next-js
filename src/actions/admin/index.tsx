"use server"

import { ResultError, ResultSuccess, ResultType } from "@/types/ResultType";

import { AdminAccount } from "@/types/AdminAccountTypes";
import { COOKIES } from "@/constants/keys";
import { __PROD__ } from "@/constants/envFlags";
import admin from "@/libs/firebaseAdminConfig";
import { cookies } from "next/headers";

export async function saveSession(idToken: string): Promise<ResultType> {
	const cookiesStore = await cookies();
	const adminAuth = admin.auth();

	const exp = 60 * 60 * 24 * 5; // 5 days

	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, sessionToken] = await Promise.all([
			adminAuth.verifyIdToken(idToken),
			adminAuth.createSessionCookie(idToken, {
				expiresIn: exp * 1000,
			})
		])

		cookiesStore.set({
			name: COOKIES.AUTH_SESSION,
			value: sessionToken,
			maxAge: exp,
			httpOnly: __PROD__,
			secure: __PROD__,
			path: "/",
			sameSite: "lax",
		});

		return { success: true, message: "Login Successfully" };
	} catch (e) {
		return {
			success: false,
			error: (e as Error).message
		};
	}
}

export async function verifySessionToken(sessionToken: string|undefined) {
	try {
		if (!sessionToken) {
			return null;
		}
	
		const decoded = await admin.auth().verifySessionCookie(sessionToken);
	
		if (!decoded) return null;
	
		const currentAdmin: AdminAccount = {
			uid: `${decoded.uid}`,
			email: `${decoded.email}`
		}

		return currentAdmin;
	} catch {
		return null;
	}
}