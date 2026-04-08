import { DateFormats } from "@/types/ProfileType";
import dayjs from "dayjs";

export default function formatDate(date: any, format: DateFormats): string | null {
	const d = dayjs(date);
	if (!d.isValid()) return null;
	return d.format(format);
}