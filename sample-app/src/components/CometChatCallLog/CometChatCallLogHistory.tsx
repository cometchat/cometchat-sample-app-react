import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import outgoingCallSuccess from "../../assets/outgoingCallSuccess.svg";
import callRejectedIcon from "../../assets/callRejectedIcon.svg";
import incomingCallIcon from "../../assets/incomingCallIcon.svg";
import incomingCallSuccessIcon from "../../assets/incomingCallSuccess.svg";
import missedCallIcon from "../../assets/missedCallIcon.svg";
import "../../styles/CometChatCallLog/CometChatCallLogHistory.css";
import { CometChatDate, CometChatList, CometChatListItem, CometChatUIKit, CometChatUIKitCalls, CometChatUIKitConstants, DatePatterns, States, convertMinutesToHoursMinutesSeconds, localize } from "@cometchat/chat-uikit-react";

export const CometChatCallDetailsHistory = (props: { call: any }) => {
    const { call } = props;
    const [callList, setCallList] = useState<any[]>([]);
    const [callListState, setCallListState] = useState(States.loading);
    const requestBuilder = useRef<any>(null);
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

    useEffect(() => {
        if (loggedInUser) {
            requestBuilder.current = setRequestBuilder();
            getCallList?.();
        }
    }, [loggedInUser]);

    const setRequestBuilder = useCallback((): any => {
        try {
            let builder;
            let callUserId;
            if (call.getInitiator().getUid() === loggedInUser!.getUid()) {
                callUserId = call.getReceiver().getUid();
            } else {
                callUserId = call.getInitiator().getUid();
            }
            const authToken = loggedInUser!.getAuthToken() || "";
            builder = new CometChatUIKitCalls.CallLogRequestBuilder()
                .setLimit(30)
                .setCallCategory("call")
                .setAuthToken(authToken);

            if (callUserId) {
                builder = builder.setUid(callUserId);
            }

            return builder.build();
        } catch (e) {
            console.log(e);
        }
    }, [loggedInUser]);


    const fetchNextCallList = useCallback(async (): Promise<any[]> => {
        try {
            const calls = await requestBuilder?.current?.fetchNext();
            return calls;
        } catch (e) {
            throw new Error("Error while fetching call list");
        }
    }, [requestBuilder]);

    const getCallList = useCallback(async () => {
        try {
            const calls = await fetchNextCallList();
            if (calls && calls.length > 0) {
                setCallList((prevCallList) => {
                    return [...prevCallList, ...calls]
                })
                setCallListState(States.loaded);
            } else if (callList.length === 0) {
                setCallListState(States.empty);
            }
        } catch (e) {
            if (callList.length === 0) {
                setCallListState(States.error);
            }
        }
    }, [fetchNextCallList, setCallList, setCallListState, callList])

    const getListItemSubtitleView = useCallback((item: any): JSX.Element => {
        return (
            <div className="cometchat-call-log-history__subtitle">
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
            <div className={getCallDuration(item) ? "cometchat-call-log-history__tail-view" : "cometchat-call-log-history__tail-view-disabled"}>
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

    const getListItem = useMemo(() => {
        return function (item: any, index: number): any {
            return (
                <>
                    <CometChatListItem
                        title={getCallStatus(item, loggedInUser!)}
                        avatarURL={getAvatarUrlForCall(item)}
                        subtitleView={getListItemSubtitleView(item)}
                        tailView={getListItemTailView(item)}
                    />
                </>
            )
        };
    }, [getAvatarUrlForCall, getListItemSubtitleView, getListItemTailView, loggedInUser]);

    return (
        <div className="cometchat-call-log-history">
            <CometChatList
                hideSearch={true}
                list={callList}
                onScrolledToBottom={getCallList}
                listItemKey="getSessionID"
                listItem={getListItem}
                state={callListState}
                showSectionHeader={false}
            />
        </div>
    )
}