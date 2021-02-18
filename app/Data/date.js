// dd/MM/yy, hh:mm
export function jsonDateToString(jsonDate) {
	const date = new Date(jsonDate);
	const time = date.toLocaleTimeString();
	const timeSliced = date.toLocaleTimeString().slice(0, time.length - 3);
	return `${timeSliced} - ${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`;
}
