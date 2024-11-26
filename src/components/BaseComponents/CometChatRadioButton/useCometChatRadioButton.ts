import { ChangeEvent, useCallback, useEffect } from "react";

export const useCometChatRadioButton = ({
    checked = false,
    onRadioButtonChanged = (input: { checked: boolean, labelText: string | undefined, id: string }) => { },
    id = "",
    name = "name",
}) => {

    useEffect(() => {
        const radioGroup = document.getElementsByName(name);
        (radioGroup as NodeListOf<HTMLInputElement>).forEach((radio) => {
            if (radio.value === id && checked == true) {
                radio.checked = true;
            }
        })
    }, [checked, name, id]);

    /* 
        This function is used to set the value of the radio button on value change.
        It also triggers the callback function with the value and the labeltext of the radio button changed. 
    */
    const updateRadioState = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const radioGroup = document.getElementsByName(name);
        (radioGroup as NodeListOf<HTMLInputElement>).forEach((radio) => {
            if (radio.value === id) {
                radio.checked = event.target?.checked;
            } else {
                radio.checked = !event.target?.checked;
            }
        })
        onRadioButtonChanged({ checked: event.target?.checked, labelText: event.target.labels?.[0].innerText, id: id });
    }, [id]);

    return {
        updateRadioState
    }
}