export default class FormDataSerializer {
	private static KEY = "data";

	public static send = <T,>(data: T): FormData => {
		const formData = new FormData();
		formData.append(FormDataSerializer.KEY, JSON.stringify(data));
		return formData;
	};

	public static get = <T,>(formData: FormData): T | null => {
		const value = formData.get(FormDataSerializer.KEY);

		if (typeof value !== "string") {
			return null;
		}

		try {
			return JSON.parse(value) as T;
		} catch {
			return null;
		}
	};
}