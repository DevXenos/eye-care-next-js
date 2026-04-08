export default function formDataMaker<T extends Record<string, unknown>>(values: T): FormData {
	const formData = new FormData();

	Object.entries(values).forEach(([key, value]) => {
		if (value === undefined || value === null) return;

		// If value is an array, append each element
		if (Array.isArray(value)) {
			value.forEach(v => formData.append(`${key}[]`, v.toString()));
		}
		// If value is an object (and not File), JSON stringify it
		else if (typeof value === "object" && !(value instanceof File)) {
			formData.append(key, JSON.stringify(value));
		}
		// Primitive or File
		else {
			formData.append(key, value as string | Blob);
		}
	});

	return formData;
}