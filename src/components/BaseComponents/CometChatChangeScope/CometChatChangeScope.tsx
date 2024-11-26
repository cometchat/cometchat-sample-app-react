import { useCometChatChangeScope } from "./useCometChatChangeScope";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
import { CometChatRadioButton } from "../CometChatRadioButton/CometChatRadioButton";
import { CometChatButton } from "../CometChatButton/CometChatButton";
import { useState } from "react";


interface ChangeScopeProps {
    /* title of the change scope view. */
    title?: string;
    /* text to be displayed on the confirm button. */
    buttonText?: string;
    /* list of the user options for the dropdown. */
    options: string[];
    /* default selected value of the list. */
    defaultSelection?: string;
    /* callback which is triggered on confirm button clicked. */
    onScopeChanged?: (scope: string) => Promise<void>;
    /* callback which is triggered on close button click. */
    onCloseClick?: () => void;
}

/*
    CometChatChangeScope is a composite component consisting of a dropdown and a confirm button. 
    It is generally used for changing the scope of group members. It accepts title, buttonText, and inputs for customization purposes. 
    It also accepts onScopeChanged and onCloseClick callbacks, which are triggered on confirm and close button clicks, respectively.
*/
const CometChatChangeScope = (props: ChangeScopeProps) => {
    const {
        title = localize("CHANGE_ROLE"),
        buttonText = localize("SAVE"),
        options = [],
        defaultSelection = "",
        onScopeChanged,
        onCloseClick = () => { },
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const {
        selectedValue,
        selectionChanged,
    } = useCometChatChangeScope({ defaultSelection });
        /* This function is used to trigger the "onScopeChanged" callback with the user selected value information. */
        const scopeChangeClicked = () => {
            setIsError(false);
            setIsLoading(true);
            if(onScopeChanged) 
            onScopeChanged(selectedValue)
                .then(() => {
                    setIsLoading(false);
                    setIsError(false);
                    if(onCloseClick){
                        onCloseClick()
                    }
                })
                .catch((error) => {
                    setIsError(true);
                    setIsLoading(false);
                });
        };
    return (
        <div className="cometchat">
                      
            <div className="cometchat-change-scope">
   
                <div className="cometchat-change-scope__icon-container">
                    <div className="cometchat-change-scope__icon" />
                </div>
                <div className="cometchat-change-scope__text">
                    <div className="cometchat-change-scope__title">
                        <label title={title} >{title}</label>
                    </div>
                    <div className="cometchat-change-scope__description">
                        {localize("CHANGE_ROLE_DESCRIPTION")}
                    </div>
                </div>
                <div className="cometchat-change-scope__list">
                    {options.map((listItr, index) => (
                        <div key={index} className="cometchat-change-scope__list-item">
                            <div className="cometchat-change-scope__list-item-label">
                            {localize(listItr.toUpperCase())}
                            </div>
                            <CometChatRadioButton name="changeScopeInput" id={listItr} checked={listItr === defaultSelection} onRadioButtonChanged={selectionChanged} />
                        </div>
                    ))}
                </div>
              {isError ?   <div className="cometchat-change-scope__error-view">
                    {localize("SOMETHING_WRONG")}
                </div> : null}
                <div className="cometchat-change-scope__button-container">
          <div className="cometchat-change-scope__cancel-button">
          <CometChatButton text={localize("CANCEL")} onClick={onCloseClick} />
          </div>
                    <div className={`cometchat-change-scope__submit-button ${defaultSelection == selectedValue ? "cometchat-change-scope__submit-button-disabled" : ""}`}>
                    <CometChatButton isLoading={defaultSelection !== selectedValue && isLoading} disabled={defaultSelection === selectedValue || isLoading} text={buttonText} onClick={scopeChangeClicked} />
                    </div>
              
                </div>
            </div>
        </div>
    )
}

export { CometChatChangeScope };