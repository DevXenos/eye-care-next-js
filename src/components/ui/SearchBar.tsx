import { useEffect, useState } from "react";
import { ChangeEvent } from "react";


export type SearchBarProps = TextFieldProps & {
	delayOnMs?: number;
	onSearch?: (query: string) => void;
	flex?: number;
};


export function useSearchBar(initialValue = "") {
	const [value, setValue] = useState(initialValue);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const clear = () => {
		setValue("");
	};

	return [value, onChange, clear] as const;
}
import { TextField, TextFieldProps } from "@mui/material";

export function SearchBar({
	delayOnMs = 1000,
	onSearch,
	value,
	onChange,
	placeholder,
	type = "search",
	flex = 1,
	sx={},
	...props
}: SearchBarProps) {

	const [internalValue, setInternalValue] = useState<string>("");

	const currentValue = (value as string) ?? internalValue;

	useEffect(() => {
		const timer = setTimeout(() => {
			onSearch?.(currentValue);
		}, delayOnMs);

		return () => clearTimeout(timer);
	}, [currentValue, delayOnMs, onSearch]);

	const handleChange: TextFieldProps["onChange"] = (e) => {
		setInternalValue(e.target.value);
		onChange?.(e);
	};

	return (
		<TextField
			{...props}
			sx={{
				flex: 1,
				...sx
			}}
			type={type}
			placeholder={(placeholder ?? "Search").replaceAll(".", '') + "... (CTRL + /)"}
			value={currentValue}
			onChange={handleChange}
		/>
	);
}