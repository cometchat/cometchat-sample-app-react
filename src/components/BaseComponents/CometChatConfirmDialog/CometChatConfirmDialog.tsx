import { useState } from "react";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
import { CometChatButton } from "../CometChatButton/CometChatButton";

interface ConfirmDialogProps {
    /** The title displayed at the top of the confirm dialog. */
    title?: string;
    /** The descriptive text inside the confirm dialog. */
    messageText?: string;
    /** The text displayed on the "cancel" button. */
    cancelButtonText?: string;
    /** The text displayed on the "confirm" button. */
    confirmButtonText?: string;
    /** Callback function for when the confirm button is clicked. */
    onSubmitClick?: () => Promise<void>;

    /** Callback function for when the cancel button is clicked. */
    onCancelClick?: () => void;
}

/*
    CometChatConfirmDialog is a dialog component that includes a title, description, and action buttons.
    It can be used for displaying warning, alert, and info popups.
    It accepts 'title' and 'messageText' props to show as the title and description of the modal.
    The 'confirmButtonText' and 'cancelButtonText' props are used to name the action buttons. Also it accepts callbacks "onSubmitClick", "onCancelClick" to be triggered on confirm and cancel buttons click.
*/
const CometChatConfirmDialog = (props: ConfirmDialogProps) => {
    const {
        title = localize("DELETE_CHAT"),
        messageText = localize("SURE_TO_DELETE_CHAT"),
        cancelButtonText = localize('CANCEL'),
        confirmButtonText = localize("DELETE"),
        onSubmitClick,
        onCancelClick,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const handleSubmitClick = ()=>{
if(onSubmitClick){
    setIsLoading(true);
    setIsError(false);
    onSubmitClick().then(()=>{
    }).then(() => {
        setIsLoading(false);
        setIsError(false);
        if(onCancelClick){
            onCancelClick()
        }
    })
    .catch((error) => {
        setIsError(true);
        setIsLoading(false);
    });
}
    }

    return (
        <div className="cometchat" style={{width:"fit-content" , height:"fit-content"}}>
                  {isError ?   <div className="cometchat-dialog-error-view cometchat-confirm-dialog-error-view">
                    {localize("SOMETHING_WRONG")}
                </div> : null}
            <div className="cometchat-confirm-dialog" >
                <div className="cometchat-confirm-dialog__icon-wrapper">
                    <div className="cometchat-confirm-dialog__icon-wrapper-icon"></div>
                </div>
                <div className="cometchat-confirm-dialog__content">
                    <div className="cometchat-confirm-dialog__content-title">
                        {title}
                    </div>
                    <div className="cometchat-confirm-dialog__content-description
    " >
                        {messageText}
                    </div>
                </div>
                <div className="cometchat-confirm-dialog__button-group">
                    <div className="cometchat-confirm-dialog__button-group-cancel">
                    <CometChatButton onClick={onCancelClick} text={cancelButtonText}/>
                    </div>
                    <div className="cometchat-confirm-dialog__button-group-submit">
                    <CometChatButton isLoading={isLoading} onClick={handleSubmitClick} text={confirmButtonText}/>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}

export { CometChatConfirmDialog };
