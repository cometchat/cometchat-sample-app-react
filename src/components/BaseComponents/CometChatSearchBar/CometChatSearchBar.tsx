import { useCometChatSearchBar } from "./useCometChatSearchBar";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";


interface SearchBarProps {
    /* default value of search input. */
    searchText?: string;
    /* placeholder text of the input. */
    placeholderText?: string;
    /* callback which is triggered after value of the input is changed. */
    onChange?: (input: { value?: string }) => void;
}

/*
    CometChatSearchBar is a generic component used for searching.
    It is generally used for searching users. It accepts searchText, which is the default value for the input, and placeholderText, which is a custom placeholder text for the input.
    It also accepts onChange, which is a custom callback triggered when the search input value changes.
*/
const CometChatSearchBar = (props: SearchBarProps) => {
    const {
        searchText = "",
        placeholderText = localize("SEARCH"),
        onChange = ({ value = "" }) => { },
    } = props;

    const { searchValue, onInputChange } = useCometChatSearchBar({ searchText, onChange });

    return (
        <div className="cometchat" style={{
            height: "inherit",
            width: "inherit"
        }}>
            <div className="cometchat-search-bar">
                <div className="cometchat-search-bar__icon"></div>
                <input className="cometchat-search-bar__input" onChange={onInputChange} placeholder={placeholderText} value={searchValue}></input>
            </div>
        </div>
    )
}

export { CometChatSearchBar };
