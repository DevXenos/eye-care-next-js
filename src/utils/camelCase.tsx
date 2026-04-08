export function TitleCase(text: string) {
	return text.slice(0, 1).toLocaleUpperCase() + text.slice(1);
}

export function CamelCase(message: string) {
	const words = message.split(" ");
	return words.map((word) => {
		return TitleCase(word);
	}).join(" ");
}