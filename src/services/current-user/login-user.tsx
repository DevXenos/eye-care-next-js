import "client-only";

import { FIREBASE_ADMIN_ERROR, FIREBASE_ADMIN_LOADING, FIREBASE_ADMIN_SUCCESS, FirebaseAdminErrorKeys } from "@/constants/firebaseMessages";

import { FirebaseError } from "firebase/app";
import { auth } from "@/libs/firebaseClientConfig";
import { saveSession } from "@/actions/admin";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";

export default async function loginUser(formData: FormData) {

	const email    = String(formData.get("email"));
	const password = String(formData.get("password"));

	toast.promise(
		signInWithEmailAndPassword(auth, email, password).then(async (userCred) => {

			const { user } = userCred;

			try {
				const idToken = await user.getIdToken();
				const res = await saveSession(idToken);

				if(!res.success) {
					throw new Error(res.error);
				}

				return user;
			} catch (e) {
				throw e;
			}
		}),
		{
			loading: FIREBASE_ADMIN_LOADING['authentication'],
			success: FIREBASE_ADMIN_SUCCESS['authentication'],
			error: (e) => {
				if (e instanceof FirebaseError) {
					const code = e.code as FirebaseAdminErrorKeys;
					const message = FIREBASE_ADMIN_ERROR[code] ?? FIREBASE_ADMIN_ERROR['default']
					return message;
				} else {
					return (e as Error).message;
				}
			}
		}
	)

	return {
		email,
		password
	}
}