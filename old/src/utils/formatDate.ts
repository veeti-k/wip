import format from "date-fns/format";
import isToday from "date-fns/isToday";
import isYesterday from "date-fns/isYesterday";

export function formatDate(date: Date) {
	if (isToday(date)) {
		return `today at ${format(date, "H:mm")}`;
	} else if (isYesterday(date)) {
		return `yesterday at ${format(date, "H:mm")}`;
	} else {
		return `on ${format(date, "eee, MMM do")} at ${format(date, "H:mm")}`;
	}
}
