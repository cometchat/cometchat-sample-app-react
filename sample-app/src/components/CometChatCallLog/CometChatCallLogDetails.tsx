import { useEffect, useState } from "react";
import "../../styles/CometChatCallLog/CometChatCallLogDetails.css";
import { CometChat, User } from "@cometchat/chat-sdk-javascript";
import { CometChatCallDetailsInfo } from "./CometChatCallLogInfo";
import { CometChatCallDetailsParticipants } from "./CometChatCallLogParticipants";
import { CometChatCallDetailsRecording } from "./CometChatCallLogRecordings";
import { CometChatCallDetailsHistory } from "./CometChatCallLogHistory";
import { CometChatMessageHeader, CometChatUIKitConstants, CometChatUIKitLoginListener, localize } from "@cometchat/chat-uikit-react";

export const CometChatCallDetails = (props: { selectedItem: any, onBack?: () => void }) => {
    const { selectedItem, onBack } = props;
    const callDetailTabItems = [localize("PARTICIPANTS"), localize("RECORDING"), localize("HISTORY")];
    const [activeTab, setActiveTab] = useState("Participants");
    const [user, setUser] = useState<User>();

    function verifyCallUser(call: any, loggedInUser: CometChat.User) {
        if (call.getInitiator().getUid() === loggedInUser.getUid()) {
            return call.getReceiver();
        } else {
            return call.getInitiator();
        }
    }

    useEffect(() => {
        const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
        const callUser = verifyCallUser(selectedItem, loggedInUser!);
        if (selectedItem.receiverType === CometChatUIKitConstants.MessageReceiverType.user) {
            CometChat.getUser(callUser.uid).then((response: User) => {
                setUser(response);
            });
        }
    }, [selectedItem]);

    return (
        <div className="cometchat-call-log-details">
            <div className="cometchat-call-log-details__header">
                <div className="cometchat-call-log-details__header-back" onClick={onBack} />
                {localize("CALL_DETAILS")}
            </div>
            <div className="cometchat-call-log-details__call-log-item">
                <CometChatMessageHeader
                    user={user}
                    disableTyping={true}
                />
            </div>

            <CometChatCallDetailsInfo call={selectedItem} />

            <div className="cometchat-call-log-details__tabs">
                {callDetailTabItems.map((tabItem) => (
                    <div
                        onClick={() => setActiveTab(tabItem)}
                        className={activeTab === tabItem ? "cometchat-call-log-details__tabs-tab-item-active" : "cometchat-call-log-details__tabs-tab-item"}
                    >
                        {tabItem}
                    </div>
                ))}
            </div>

            <>
                {activeTab === "Participants" ? <CometChatCallDetailsParticipants call={selectedItem} />
                    : activeTab === "Recording" ? <CometChatCallDetailsRecording call={selectedItem} />
                        : activeTab === "History" ? <CometChatCallDetailsHistory call={selectedItem} />
                            : null
                }
            </>
        </div>
    )
}