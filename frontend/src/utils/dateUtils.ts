/**
 * Formats a timestamp string to dd/MM/yyyy HH:mm:ss format
 * @param timestamp The timestamp string to format
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: string): string => {
    try {
        const date = new Date(timestamp)

        // Format to dd/MM/yyyy HH:mm:ss
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    } catch (e) {
        return timestamp
    }
}

/**
 * Formats a date to dd/MM/yyyy format
 * @param date The date to format (string or Date object)
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date

        const day = dateObj.getDate().toString().padStart(2, '0')
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
        const year = dateObj.getFullYear()

        return `${day}/${month}/${year}`
    } catch (e) {
        return typeof date === 'string' ? date : date.toString()
    }
}

/**
 * Formats a date to a locale-specific format with custom options
 * @param date The date to format (string or Date object)
 * @param options Intl.DateTimeFormatOptions to customize the formatting
 * @param locale Optional locale string (defaults to user's locale)
 * @returns Formatted date string
 */
export const formatDateWithOptions = (
    date: string | Date,
    options: Intl.DateTimeFormatOptions,
    locale?: string
): string => {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return new Intl.DateTimeFormat(locale, options).format(dateObj)
    } catch (e) {
        return typeof date === 'string' ? date : date.toString()
    }
}

export const dayOfWeek = (date: Date) => {
    const dayOfWeek = date.getDay();
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ 7"];
    return days[dayOfWeek];
}

export const plusMonth = (date: Date, month: string): Date => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + Number(month));
    return newDate;
}
