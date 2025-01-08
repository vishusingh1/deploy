export const to_iso_string = (date: Date) => {
    const pad = (num: number) => {
        return (num < 10 ? '0' : '') + num;
    };
    return (
        date.getFullYear() +
        '-' +
        pad(date.getMonth() + 1) +
        '-' +
        pad(date.getDate()) +
        'T' +
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes())
    );
};