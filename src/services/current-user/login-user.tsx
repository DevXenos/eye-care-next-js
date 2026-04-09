import "client-only";

import { FIREBASE_ADMIN_ERROR, FirebaseAdminErrorKeys } from "@/constants/firebaseMessages";

import { AdminAccount } from "@/types/AdminAccountTypes";
import { FirebaseError } from "firebase/app";
import { auth } from "@/libs/firebaseClientConfig";
import { saveSession } from "@/actions/admin";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function loginUser(formData: FormData): Promise<AdminAccount> {

	const email    = String(formData.get("email"));
	const password = String(formData.get("password"));

	try {
		const user = await signInWithEmailAndPassword(auth, email, password).then(async (userCred) => {
			const { user } = userCred;
	
			try {
				const idToken = await user.getIdToken();
				const res = await saveSession(idToken);
	
				if (!res.success) {
					throw new Error(res.error);
				}
	
				return user;
			} catch (e) {
				throw e;
			}
		});
		
		return {
			uid: user.uid,
			email,
		}
	} catch (e) {
		if (e instanceof FirebaseError) {
			const code = e.code as FirebaseAdminErrorKeys;
			const message = FIREBASE_ADMIN_ERROR[code] ?? code;
			throw new Error(message);
		} else {
			throw new Error((e as Error).message);
		}
	}
}