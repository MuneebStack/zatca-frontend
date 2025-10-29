import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const BACKEND_FORMAT = "YYYY-MM-DDTHH:mm:ss[Z]";

export const formatDate = (date?: string | dayjs.Dayjs, format = DEFAULT_DISPLAY_FORMAT): string => {
    let formattedDate = '';

    if (date) {
        const adjustedDate = dayjs(date);
        formattedDate = adjustedDate.utc().tz(dayjs.tz.guess()).format(format);
    }

    return formattedDate;
};

export const toUtcString = (date?: string | dayjs.Dayjs): string => {
    let formattedDate = '';

    if (date) {
        const adjustedDate = dayjs(date);
        formattedDate = adjustedDate.utc().format(BACKEND_FORMAT);
    }

    return formattedDate;
};
