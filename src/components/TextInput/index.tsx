import { inputStyle, labelContainerStyle, labelStyle, labelTextStyle, requiredSymbolStyle } from "./style";

import { CometChatThemeContext } from "@cometchat/chat-uikit-react";
import { useContext } from "react";

interface ITextInputProps {
    labelText : string,
    placeholderText : string,
    value : string,
    onValueChange : (newValue : string) => void
    required? : boolean
};

export function TextInput(props : ITextInputProps) {
    const {
        labelText,
        placeholderText,
        value,
        onValueChange,
        required = false
    } = props;

    const { theme } = useContext(CometChatThemeContext);

    function getLabel() {
        let labelJSX = (
            <span
                style = {labelTextStyle(theme)}
            >
                {labelText}
            </span>
        );
        if (required) {
            labelJSX = (
                <span
                    style = {labelContainerStyle()}
                >
                    {labelJSX}
                    <span
                        style = {requiredSymbolStyle()}
                    >
                        *
                    </span>
                </span>
            );
        }
        return labelJSX;
    }

    return (
        <label
            style = {labelStyle()}
        >
            {getLabel()}
            <input
                type = "text"
                placeholder = {placeholderText}
                value = {value}
                onChange = {e => onValueChange(e.target.value)}
                required = {required}
                style = {inputStyle(theme)}
            />
        </label>
    );
}
