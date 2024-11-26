import { useEffect, useState } from "react";
import { useCometChatRadioButton } from "./useCometChatRadioButton";
interface RadioButtonProps {
    /* default value of the radio button. */
    checked?: boolean;
    /* alternative name provided to the radio button. */
    name?: string;
    /* text to be displayed for the radio button label. */
    labelText?: string;
    /* flag used for enabling/diisabling the button. */
    disabled?: boolean;
    /* unique key to be provided for id purpose. */
    id?: string;
    /* callback which is triggered on radio button value is changed. */
    onRadioButtonChanged?: (input: { checked: boolean, labelText: string | undefined, id: string }) => void;
}

/* 
    CometChatRadioButton is a generic component generally used for radio button input. 
    It accepts "labelText" for the text to be displayed with the radio button, and a callback function that is triggered when the radio button value is changed.
*/
const CometChatRadioButton = (props: RadioButtonProps) => {
    const {
        checked = false,
        name = "name",
        labelText = "",
        disabled = false,
        id = "",
        onRadioButtonChanged = () => { },
    } = props;
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const { updateRadioState } = useCometChatRadioButton({ checked, onRadioButtonChanged, id, name });

    return (
        <div className="cometchat">
            <div className="cometchat-radiobutton">
                <label className="cometchat-radiobutton__label">
                    <input type="radio" name={name} onChange={updateRadioState} disabled={disabled} value={id} />
                    <span className="cometchat-radiobutton__selected"></span>
                    {labelText}
                </label>
            </div>
        </div>
    )
}

export { CometChatRadioButton };