import { DatePatterns } from "../../../Enums/Enums";
import { useCometChatDate } from "./useCometChatDate";
interface DateProps {
    /* Timestamp of the time to be displayed in the component. */
    timestamp: number;
    /* Pattern in which the time should be displayed. */
    pattern?: DatePatterns;
    /* time string to be displayed as it is in the component. */
    customDateString?: string | null;
}

/**
 * CometChatDate is a generic component used to display dates in the required format.
 * It accepts a timestamp of the time to be displayed and the pattern in which the time should be displayed.
 * It also accepts the customDateString prop, whose value is used as is for displaying the time.
 */
const CometChatDate = (props: DateProps) => {
    const {
        timestamp,
        pattern = DatePatterns.time,
        customDateString = null,
    } = props;
    /**
    * Retrieves the converted timestamp value based on the provided date pattern.
  */
    const { getFormattedDate } = useCometChatDate({ timestamp, pattern, customDateString });

    return (
        <div className="cometchat">
            <div className="cometchat-date">
                {getFormattedDate()}
            </div>
        </div>
    )
}

export { CometChatDate };
