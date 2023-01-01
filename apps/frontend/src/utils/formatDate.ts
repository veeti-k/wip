import format from "date-fns/format";
import isToday from "date-fns/isToday";
import isYesterday from "date-fns/isYesterday";

export const formatDate = (date: Date) => {
	if (isToday(date)) return `today ${format(date, "H:mm")}`;
	else if (isYesterday(date)) return `yesterday ${format(date, "H:mm")}`;
	else return format(date, "d.M.yyyy H:mm");
};
