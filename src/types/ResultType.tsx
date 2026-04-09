export type ResultSuccess = {
	success: true;
	message: string;
}

export type ResultError = {
	success: false;
	error: string;
}

export type ResultType =
	| ResultSuccess
	| ResultError;