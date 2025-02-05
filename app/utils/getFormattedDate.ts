export function getFormattedDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}
