import { ChangeEvent, useCallback, useState } from "react"

export const useCometChatSearchBar = ({
    searchText = "",
    onChange = ({ value: string = "" }) => { },
}) => {
    const [searchValue, setSearchValue] = useState(searchText);

    /*
        This event is triggered on input value change for seach input.
        The custom "onChange" callback is called from this event with search value information.
    */
    const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        onChange({ value: event.target.value });
    }, []);

    return {
        searchValue,
        onInputChange,
    }
}
