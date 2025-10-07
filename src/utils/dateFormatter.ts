function formatDate(
    date?: string | number | Date,
    options: Intl.DateTimeFormatOptions = {},
): string {
    if (!date) return '-';

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '-';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        ...options,
    };

    return parsedDate.toLocaleString(undefined, defaultOptions);
}

function formatRelative(date: string | number | Date): string {
    if (!date) return '-';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '-';

    const diff = parsedDate.getTime() - Date.now();
    const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    const seconds = Math.round(diff / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (Math.abs(days) >= 1) return formatter.format(days, 'day');
    if (Math.abs(hours) >= 1) return formatter.format(hours, 'hour');
    if (Math.abs(minutes) >= 1) return formatter.format(minutes, 'minute');
    return formatter.format(seconds, 'second');
}

export {
    formatDate,
    formatRelative
}
