// --- Admin Error Keys ---
export type FirebaseAdminErrorKeys =
	| "auth/user-not-found"
	| "auth/user-disabled"
	| "auth/email-already-exists"
	| "auth/operation-not-allowed"
	| "permission-denied"
	| "unavailable"
	| "not-found"
	| "already-exists"
	| "deadline-exceeded"
	| "auth/wrong-password"
	| "default";

export const FIREBASE_ADMIN_ERROR: Record<FirebaseAdminErrorKeys, string> = {
	"auth/user-not-found": "Invalid email or password. Please try again.",
	"auth/wrong-password": "Invalid email or password. Please try again.",
	"auth/user-disabled": "This user account has been disabled.",
	"auth/email-already-exists": "The email address is already in use by another account.",
	"auth/operation-not-allowed": "Operation not allowed. Please contact admin.",
	"permission-denied": "You do not have permission to perform this action.",
	"unavailable": "Service temporarily unavailable. Try again later.",
	"not-found": "The requested document or collection was not found.",
	"already-exists": "The document already exists.",
	"deadline-exceeded": "The operation took too long. Try again.",
	"default": "An unexpected error occurred. Please try again."
};

// --- Admin Loading Keys ---
export type FirebaseAdminLoadingKeys =
	| "authentication"
	| "creating-user"
	| "updating-user"
	| "deleting-user"
	| "reading-document"
	| "writing-document"
	| "deleting-document"
	| "running-cloud-function";

export const FIREBASE_ADMIN_LOADING: Record<FirebaseAdminLoadingKeys, string> = {
	authentication: "Authenticating user...",
	"creating-user": "Creating new user...",
	"updating-user": "Updating user information...",
	"deleting-user": "Deleting user account...",
	"reading-document": "Fetching data...",
	"writing-document": "Saving data...",
	"deleting-document": "Deleting data...",
	"running-cloud-function": "Executing operation..."
};

// --- Admin Success Keys ---
export type FirebaseAdminSuccessKeys =
	| "authentication"
	| "creating-user"
	| "updating-user"
	| "deleting-user"
	| "reading-document"
	| "writing-document"
	| "deleting-document"
	| "running-cloud-function";

export const FIREBASE_ADMIN_SUCCESS: Record<FirebaseAdminSuccessKeys, string> = {
	authentication: "Admin logged in successfully.",
	"creating-user": "New user created successfully.",
	"updating-user": "User information updated successfully.",
	"deleting-user": "User account deleted successfully.",
	"reading-document": "Data fetched successfully.",
	"writing-document": "Data saved successfully.",
	"deleting-document": "Data deleted successfully.",
	"running-cloud-function": "Operation executed successfully."
};