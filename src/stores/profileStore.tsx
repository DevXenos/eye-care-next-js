"use client"

import { ProfileType, dateFormats } from '@/types/ProfileType';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import { User } from 'firebase/auth';
import { create } from 'zustand';
import { db } from '@/libs/firebaseClientConfig';
import { useAdmin } from '@/app/dashboard/AdminWrapper';
import { useEffect } from 'react';

export type UpdateProfileParam = Partial<ProfileType>;

export type ProfileStoreState = {
	profile: ProfileType;
	setProfile: (profile: ProfileType) => void;
	updateProfile: (uid: string, param: UpdateProfileParam) => Promise<void>;
};

const initial: ProfileType = {
	dateFormat: dateFormats[0], // Take first value
};

export const profileStore = create<ProfileStoreState>((set) => {
	return ({
		updateProfile: async (uid, data) => {
			try {
				const ref = doc(db, "profiles", uid);
				await setDoc(ref, data, { merge: true });
			} catch (e) {
				throw e;
			}
		},
		profile: initial,
		setProfile: (profile) => set({profile})
	})
});

export function useProfile(uid: User['uid']) {
	const { profile, setProfile, updateProfile } = profileStore.getState();

	useEffect(() => {
			const docRef = doc(db, "profiles", uid);
	
			const unsubscribe = onSnapshot(docRef, (docSnap) => {
				if (docSnap.exists()) {
					setProfile(docSnap.data() as ProfileType);
				} else {
					// No settings found in DB? Keep the initial defaults.
					setProfile(initial);
				}
			}, (error) => {
				console.error("Profile Fetch Error:", error);
			});
	
			return () => unsubscribe();
		}, [uid, setProfile]);

	return {
		profile, updateProfile
	}
}