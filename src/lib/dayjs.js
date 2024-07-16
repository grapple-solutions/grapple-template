import dayjs from "dayjs";
import dayjsUtc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjslocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(dayjslocalizedFormat);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsUtc);
dayjs.locale("de");

export { dayjs };