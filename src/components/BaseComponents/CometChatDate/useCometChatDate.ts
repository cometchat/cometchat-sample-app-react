import { DatePatterns } from "../../../Enums/Enums";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";

export const useCometChatDate = ({
    timestamp = 0,
    pattern = DatePatterns.time,
    customDateString = null,
}: { timestamp: number; pattern: DatePatterns; customDateString: string | null }) => {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const date = new Date(timestamp * 1000);


    /* purpose of this function is to return the short form string for the month using date. */
    const getMonthOfDay = () => {
        let month = date.getMonth();
        let mnth = monthNames[month];
        return mnth.substring(0, 3);
    };

    /* This function is used to return the format in which the date should be displayed. */
    const getDateFormat = () => {
        if (pattern === DatePatterns.DayDate) {
            return date.getDate() + " " + getMonthOfDay() + ", " + date.getFullYear();
        }
        let dt: number | string = date.getDate();
        if (dt < 10) {
            dt = "0" + dt;
        }
        return dt + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    };

    /* This function returns the minute value. */
    const getMinute = (date: Date) => {
        if (date.getMinutes() < 10) {
            return `0${date.getMinutes()}`;
        } else { return date.getMinutes() };
    };

    /* This function is used to return the format in which the time should be displayed. */
    const getTimeFormat = () => {
        let timeString: number | string = date.getHours();
        let postString = "AM";
        if (timeString > 11) {
            postString = "PM";
            timeString = timeString !== 12 ? timeString % 12 : timeString;
        }
        if (timeString < 10) {
            timeString = `0${timeString}`;
        }
        return timeString + ":" + getMinute(date) + " " + postString;
    };

    /* This function is used to return both date and time format. */
    const getDateTimeFormat = () => {
        let timeString: number | string = date.getHours();
        let postString = "AM";
        if (timeString > 11) {
            postString = "PM";
            timeString = timeString !== 12 ? timeString % 12 : timeString;
        }
        if (timeString < 10) {
            timeString = `0${timeString}`;
        }
        let newDate = date.getDate() + " " + getMonthOfDay();
        return newDate + ", " + timeString + ":" + getMinute(date) + " " + postString;
    }

    /* This function is used to return whether the date is "today", "yesterday" or returns date in required format. */
    const getDate = () => {
        const today = new Date();
        if (
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear()
        ) {
            let diff = today.getDate() - date.getDate();
            if (diff === 0) {
                if (pattern === DatePatterns.DayDateTime) {
                    return getTimeFormat();
                }
                return localize("TODAY");
            } else if (diff === 1) {
                return localize("YESTERDAY");
            } else if (diff < 7) {
                return getDateFormat();
            } else {
                return getDateFormat();
            }
        } else {
            return getDateFormat();
        }
    };

    /* Purpose of this function is to invoke the logic for date-timme generation or directly return the customDateString if provided. */
    const getFormattedDate = () => {
        if (customDateString) {
            return customDateString;
        } else if (pattern != null) {
            let formattedDate: string = "";
            switch (pattern) {
                case DatePatterns.time:
                    formattedDate = getTimeFormat();
                    break;
                case DatePatterns.DayDate:
                case DatePatterns.DayDateTime:
                    formattedDate = getDate();
                    break;
                case DatePatterns.DateTime:
                    formattedDate = getDateTimeFormat();
                    break;
                default:
                    break;
            }
            return formattedDate;
        }
        return null;
    };

    return {
        getFormattedDate,
    }
}