import { useCallback, useRef } from "react";
import endCallIcon from '../../../assets/call_end.svg'
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useCometChatOutgoingCall } from "./useCometChatOutgoingCall";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
import { CometChatButton } from "../../BaseComponents/CometChatButton/CometChatButton";
import { CometChatAvatar } from "../../BaseComponents/CometChatAvatar/CometChatAvatar";
import { CometChatSoundManager } from "../../../resources/CometChatSoundManager/CometChatSoundManager";

/**
 * Props interface for the outgoing call component
 */
interface OutgoingCallProps {
    /**
     * Sets the call object for CometChatOutgoingCall.
     */
    call: CometChat.Call;
  
    /**
     * Used to disable/enable the sound of outgoing calls.
     * 
     * @default false
     * @example disableSoundForCalls={false}
     */
    disableSoundForCalls?: boolean;
  
    /**
     * Used to set a custom sound for outgoing calls.
     * 
     * @example customSoundForCalls='Your Custom Sound For Calls'
     */
    customSoundForCalls?: string;
  
    /**
     * Custom view for the outgoing call component.
     */
    customView?: any;
  
    /**
     * Triggered when an error occurs in the outgoing call component.
     */
    onError?: Function;
  
    /**
     * Triggered when the close button is clicked in the outgoing call component.
     */
    onCloseClicked?: Function;
  }

const CometChatOutgoingCall = (props: OutgoingCallProps) => {
    /**
     * Destructure props and set default values
     */
    const {
        call,
        disableSoundForCalls = false,
        customSoundForCalls = "",
        customView = null,
        onError = (error: CometChat.CometChatException) => { console.log(error); },
        onCloseClicked = () => { }
    } = props;


    const callRef = useRef<CometChat.Call | null>(null);
    callRef.current = call!;
    let subtitleText: string = localize("CALLING");
    /**
   * Callback to handle errors, ensuring errors are wrapped in a CometChatException object.
   */
    const onErrorCallback = useCallback((error: any) => {
        if (!(error instanceof CometChat.CometChatException)) {
            let errorModel = {
                code: error?.code,
                name: error?.name,
                message: error?.message,
                details: error?.details
            }
            let errorObj = new CometChat.CometChatException(errorModel);
            onError!(errorObj);
        } else {
            onError!(error);
        }
    }, [onError]);
    /**
       * Handles the logic to close the outgoing call and stops the sound.
       */
    const onClose = useCallback(() => {
        try {
            CometChatSoundManager.pause();
            if (onCloseClicked) {
                onCloseClicked();
            }
        } catch (e) {
            onErrorCallback(e);
        }
    }, [onCloseClicked, onErrorCallback])
    /**
       * Get the avatar URL based on the receiver type (user or group).
       */
    const getAvatarURL = () => {
        return callRef.current?.getReceiverType() === CometChatUIKitConstants.MessageReceiverType.user ? (callRef.current?.getReceiver() as CometChat.User)?.getAvatar() : (callRef.current?.getReceiver() as CometChat.Group)?.getIcon();
    }
    /**
     * Function to play the custom or default call sound.
     */
    const playAudio = useCallback(() => {
        try {
            if (!disableSoundForCalls) {
                if (customSoundForCalls) {
                    CometChatSoundManager.play(CometChatSoundManager.Sound.outgoingCall!, customSoundForCalls)
                } else {
                    CometChatSoundManager.play(CometChatSoundManager.Sound.outgoingCall!)
                }
            }
        } catch (e) {
            onErrorCallback(e);
        }
    }, [disableSoundForCalls, customSoundForCalls, onErrorCallback])

    useCometChatOutgoingCall(
        playAudio,
        call,
    );

    return (
        <>
            <div className="cometchat">
                {callRef.current ? <>
                    {customView ? customView : <div className="cometchat-outgoing-call">
                        <div>
                            <div className="cometchat-outgoing-call__title">{callRef.current?.getReceiver()?.getName()}</div>
                            <div className="cometchat-outgoing-call__subtitle">{subtitleText}</div></div>
                        <div className="cometchat-outgoing-call__avatar">
                            <CometChatAvatar name={callRef.current?.getReceiver()?.getName()} image={getAvatarURL()} />
                        </div>
                        <div className="cometchat-outgoing-call__button">
                            <CometChatButton onClick={onClose} iconURL={endCallIcon} />
                        </div>
                    </div>}</> : null}

            </div>
        </>

    );
};

export { CometChatOutgoingCall };
