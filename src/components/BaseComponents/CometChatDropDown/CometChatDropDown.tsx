import { useCometChatDropDown } from "./useCometChatDropDown";
interface onOptionsChangedEvent {
    /** The value of the selected option from the dropdown. */
    value?: string;
}
interface DropDownProps {
    /** List of options to be displayed in the dropdown. */
    options: string[];
    /** Value from the list to be selected by default. */
    selectedOption?: string;
    /** Callback invoked when the dropdown selection changes. */
    onOptionsChanged?: (input: onOptionsChangedEvent) => void;
}

/*
    CometChatDropDown is a generic component which can be used as a dropdown with custom options list.
    It accepts "options" prop which is an array of strings and "selectedOption"(optional) for the default selected value.
    It also accepts 'onOptionsChanged' which is a callback function that triggers when the dropdown options change.
*/
const CometChatDropDown = (props: DropDownProps) => {
    const {
        options = [],
        selectedOption = options[0],
        onOptionsChanged = ({ value: string = "" }) => { },
    } = props;

    const {
        dropdownVisible,
        selectedOptionState,
        onButtonClick,
        onOptionClick
    } = useCometChatDropDown({ selectedOption, onOptionsChanged });

    return (
        <div className="cometchat">
            <div className="cometchat-dropdown">
                <button
                    name="button"
                    className="cometchat-dropdown__placeholder-text"
                    onClick={onButtonClick}
                >
                    <label title={selectedOptionState}>{selectedOptionState}</label>
                    <div
                        className="cometchat-dropdown__arrow"
                    />
                </button >
                <div className={dropdownVisible ? "cometchat-dropdown__items" : "cometchat-dropdown__items-hidden"}>
                    {options.map((option: string, index: number) => (
                        <div
                            key={index}
                            className="cometchat-dropdown__item"
                            onClick={() => {
                                onOptionClick(option);
                            }}
                        >
                            <label className="cometchat-dropdown__item-label" title={option}>{option}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { CometChatDropDown };