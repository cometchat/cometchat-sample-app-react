import { useCallback, useEffect, useState } from "react";

export const useCometChatChangeScope = ({
    defaultSelection = "",
}) => {
    const [selectedValue, setSelectedValue] = useState(defaultSelection);
    useEffect(() => {
        setSelectedValue(defaultSelection);
    }, [defaultSelection]);

    /* The purpose of this function is to update the state of the dropdown value. */
    const selectionChanged: (input: { checked: boolean, labelText: string | undefined, id: string }) => void = useCallback(({ id = "" }) => {
        setSelectedValue(id);
    }, []);
    return {
        selectedValue,
        selectionChanged,
    }
}