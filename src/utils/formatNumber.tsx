type Options = {
	currency?: boolean;
}

export default function formatNumber(amount: number, options: Options = {}) {
	return new Intl.NumberFormat('en-US', {
		...(options.currency && {
			style: "currency",
			currency: "PHP"
		})
	}).format(amount);
}