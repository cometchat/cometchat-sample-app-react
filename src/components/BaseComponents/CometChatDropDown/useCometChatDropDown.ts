import { MouseEvent, useCallback, useEffect, useState } from "react";

export const useCometChatDropDown = ({
    selectedOption = "",
    onOptionsChanged = ({ value: string = "" }) => { },
}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedOptionState, setSelectedOption] = useState(selectedOption);

    useEffect(() => {
        setSelectedOption(selectedOption);
    }, [selectedOption]);

    /* This function is triggered when the user clicks the dropdown arrow to view the options. */
    const onButtonClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        setDropdownVisible((prevState) => {
            return !prevState;
        });
    }, []);

    /* This function is triggered when the selected option in the dropdown changes. 
    It also invokes the onOptionsChanged callback and provides the selected option data. */
    const onOptionClick = useCallback((selectedOption: string) => {
        setSelectedOption(selectedOption);
        onOptionsChanged({ value: selectedOption });
        setDropdownVisible(false);
    }, []);

    return {
        selectedOptionState,
        dropdownVisible,
        onButtonClick,
        onOptionClick
    }
}