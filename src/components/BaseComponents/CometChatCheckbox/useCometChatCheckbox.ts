import { ChangeEvent, useEffect, useState } from "react"

export const useCometChatCheckbox = ({
    checked = false,
    onCheckBoxValueChanged = (input: { checked: boolean, labelText: string | undefined }) => {}
 }) => {
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    /*
        This function is used to set the value of the check-box on value change.
        It also triggers the callback function with the value and the labeltext of the check-box changed. 
    */
    const updateCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target?.checked);
        onCheckBoxValueChanged({ checked: event.target?.checked, labelText: event.target.labels?.[0].innerText });
    }

    return {
        isChecked,
        updateCheckbox,
    }
}