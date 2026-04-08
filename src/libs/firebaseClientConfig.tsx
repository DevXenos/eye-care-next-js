import "client-only";

import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

import { __DEV__ } from "@/constants/envFlags";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyCL5LM_4fIAJZPHzE2rixydyHRjgbQ22bQ",
	authDomain: "eye-care-dela-luna.firebaseapp.com",
	databaseURL: "https://eye-care-dela-luna-default-rtdb.firebaseio.com",
	projectId: "eye-care-dela-luna",
	storageBucket: "eye-care-dela-luna.firebasestorage.app",
	messagingSenderId: "100294651871",
	appId: "1:100294651871:web:43f1abcab9aa54f7fd1e6a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (__DEV__) {
	connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
	connectFirestoreEmulator(db, 'localhost', 8080);
}