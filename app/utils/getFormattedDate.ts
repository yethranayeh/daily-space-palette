// TODO: move to @/app/lib/utils.ts
export function getFormattedDate() {
	const today = new Date();
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/Los_Angeles", // Assuming NASA's servers run on PST timezone
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	});
	const parts = formatter.formatToParts(today);

	const year = parts.find((part) => part.type === "year")!.value;
	const month = parts.find((part) => part.type === "month")!.value;
	const day = parts.find((part) => part.type === "day")!.value;

	return `${year}-${month}-${day}`;
}
