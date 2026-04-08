import admin from "firebase-admin"; // admin SDK

export type Prefix<T extends string = ''> = `${T}${string}`;

// Use Admin SDK timestamp type
export type CreatedAt = admin.firestore.Timestamp;
export type UpdatedAt = admin.firestore.Timestamp;