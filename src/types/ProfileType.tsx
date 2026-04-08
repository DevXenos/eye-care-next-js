import dayjs from "dayjs";

export const dateFormats = [
	"MM/DD/YYYY",
	"DD/MM/YYYY",
	"MMM DD, YYYY",
	"YYYY-MM-DD",
] as const;

export type DateFormats = (typeof dateFormats)[number];

const today = dayjs();

export const dateFormatsSample: Record<DateFormats, string> = {
	"MM/DD/YYYY": today.format("MM/DD/YYYY"),     // 03/08/2026
	"DD/MM/YYYY": today.format("DD/MM/YYYY"),     // 08/03/2026
	"MMM DD, YYYY": today.format("MMM DD, YYYY"), // Mar 08, 2026
	"YYYY-MM-DD": today.format("YYYY-MM-DD"),     // 2026-03-08
};

export type ProfileType = {
	dateFormat: DateFormats;
};