"use server"

import { AdminAccount } from "@/types/AdminAccountTypes";
import { COLLECTIONS } from "@/constants/keys";
import { ProfileType } from "@/types/ProfileType";
import { ResultType } from "@/types/ResultType";
import admin from "@/libs/firebaseAdminConfig";

export async function updateProfile(uid: AdminAccount['uid'], profile: Partial<ProfileType>): Promise<ResultType> {
	const adminDb = admin.firestore();

	try {
		await adminDb.collection(COLLECTIONS.PROFILE).doc(uid).set(profile, { merge: true });
		return {
			success: true,
			message: "Profile Updated Successfully"
		}
	} catch(e) {
		return {
			success: false,
			error: (e as Error).message
		}
	}
}