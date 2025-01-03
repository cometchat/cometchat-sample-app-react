import { useCallback, useEffect, useState } from "react";
import outgoingCallSuccess from "../../assets/outgoingCallSuccess.svg";
import callRejectedIcon from "../../assets/callRejectedIcon.svg";
import incomingCallIcon from "../../assets/incomingCallIcon.svg";
import incomingCallSuccessIcon from "../../assets/incomingCallSuccess.svg";
import missedCallIcon from "../../assets/missedCallIcon.svg";
import "../../styles/CometChatCallLog/CometChatCallLogInfo.css";
import { CometChatDate, CometChatListItem, CometChatUIKit, CometChatUIKitConstants, DatePatterns, convertMinutesToHoursMinutesSeconds, localize } from "@cometchat/chat-uikit-react";

export const CometChatCallDetailsInfo = (props: { call: any }) => {
    const { call } = props;
    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);

    useEffect(
        () => {
            CometChatUIKit.getLoggedinUser().then(
                (user) => {
                    setLoggedInUser(user);
                }
            );
        },
        [setLoggedInUser]
    );

    const getListItemSubtitleView = useCallback((item: any): JSX.Element => {
        return (
            <div className="cometchat-call-log-info__subtitle">
                <CometChatDate
                    pattern={DatePatterns.DateTime}
                    timestamp={item?.getInitiatedAt()}
                ></CometChatDate>
            </div>
        );
    }, [])

    const getCallDuration = useCallback((item: any) => {
        try {
            if (item?.getTotalDurationInMinutes()) {
                return convertMinutesToHoursMinutesSeconds(item?.getTotalDurationInMinutes());
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }, []);

    const getListItemTailView = useCallback((item: any): JSX.Element => {
        return (
            <div className={getCallDuration(item) ? "cometchat-call-log-info__trailing-view" : "cometchat-call-log-info__trailing-view-disabled"}>
                {getCallDuration(item) ? getCallDuration(item) : '00:00'}
            </div>
        );
    }, [getCallDuration]);

    const getCallStatus = (call: CometChat.Call, loggedInUser: CometChat.User): string => {
        const isSentByMe = (call: any, loggedInUser: CometChat.User) => {
            const senderUid: string = call.callInitiator?.getUid();
            return !senderUid || senderUid === loggedInUser?.getUid();
        }
        const callStatus: string = call.getStatus();
        const isSentByMeFlag: boolean = isSentByMe(call, loggedInUser!);
        if (isSentByMeFlag) {
            switch (callStatus) {
                case CometChatUIKitConstants.calls.initiated:
                    return localize("OUTGOING_CALL");
                case CometChatUIKitConstants.calls.cancelled:
                    return localize("CANCELLED_CALL");
                case CometChatUIKitConstants.calls.rejected:
                    return localize("REJECTED_CALL");
                case CometChatUIKitConstants.calls.busy:
                    return localize("MISSED_CALL");
                case CometChatUIKitConstants.calls.ended:
                    return localize("CALL_ENDED");
                case CometChatUIKitConstants.calls.ongoing:
                    return localize("CALL_ANSWERED");
                case CometChatUIKitConstants.calls.unanswered:
                    return localize("UNANSWERED_CALL");
                default:
                    return localize("OUTGOING_CALL");
            }
        } else {
            switch (callStatus) {
                case CometChatUIKitConstants.calls.initiated:
                    return localize("INCOMING_CALL");
                case CometChatUIKitConstants.calls.ongoing:
                    return localize("CALL_ANSWERED");
                case CometChatUIKitConstants.calls.ended:
                    return localize("CALL_ENDED");
                case CometChatUIKitConstants.calls.unanswered:
                case CometChatUIKitConstants.calls.cancelled:
                    return localize("MISSED_CALL");
                case CometChatUIKitConstants.calls.busy:
                    return localize("CALL_BUSY");
                case CometChatUIKitConstants.calls.rejected:
                    return localize("REJECTED_CALL");
                default:
                    return localize("OUTGOING_CALL");
            }
        }
    }

    function getAvatarUrlForCall(call: CometChat.Call) {
        const isSentByMe = (call: any, loggedInUser: CometChat.User) => {
            const senderUid: string = call.initiator?.getUid();
            return !senderUid || senderUid === loggedInUser?.getUid();
        }
        const isSentByMeFlag: boolean = isSentByMe(call, loggedInUser!);
        const callStatus = getCallStatus(call, loggedInUser!);
        if (isSentByMeFlag) {
            switch (callStatus) {
                case localize("OUTGOING_CALL"):
                    return outgoingCallSuccess;
                case localize("INCOMING_CALL"):
                    return outgoingCallSuccess;
                case localize("CANCELLED_CALL"):
                    return outgoingCallSuccess;
                case localize("REJECTED_CALL"):
                    return callRejectedIcon;
                case localize("CALL_BUSY"):
                    return missedCallIcon;
                case localize("CALL_ENDED"):
                    return outgoingCallSuccess;
                case localize("CALL_ANSWERED"):
                    return outgoingCallSuccess;
                case localize("UNANSWERED_CALL"):
                    return missedCallIcon;
                case localize("MISSED_CALL"):
                    return missedCallIcon;
                default:
                    return "";
            }
        } else {
            switch (callStatus) {
                case localize("OUTGOING_CALL"):
                    return incomingCallSuccessIcon;
                case localize("INCOMING_CALL"):
                    return incomingCallSuccessIcon;
                case localize("CANCELLED_CALL"):
                    return incomingCallIcon;
                case localize("REJECTED_CALL"):
                    return callRejectedIcon;
                case localize("CALL_BUSY"):
                    return missedCallIcon;
                case localize("CALL_ENDED"):
                    return incomingCallSuccessIcon;
                case localize("CALL_ANSWERED"):
                    return incomingCallSuccessIcon;
                case localize("UNANSWERED_CALL"):
                    return missedCallIcon;
                case localize("MISSED_CALL"):
                    return missedCallIcon;
                default:
                    return "";
            }
        }
    }

    return (
        <div className="cometchat-call-log-info">
            <CometChatListItem
                title={getCallStatus(call, loggedInUser!)}
                avatarURL={getAvatarUrlForCall(call)}
                subtitleView={getListItemSubtitleView(call)}
                trailingView={getListItemTailView(call)}
            />
        </div>
    )
}