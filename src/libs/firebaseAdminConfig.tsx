import "server-only";

import { __DEV__ } from "@/constants/envFlags";
import admin from "firebase-admin";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if(__DEV__) {
	process.env.FIREBASE_AUTH_EMULATOR_HOST="localhost:9099";
	process.env.FIRESTORE_EMULATOR_HOST="localhost:8080";
}

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId,
			clientEmail,
			privateKey,
		}),
	});
}

export default admin;