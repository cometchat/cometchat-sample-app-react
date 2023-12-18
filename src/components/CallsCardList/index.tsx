import CallLogHistorySVG from "../../assets/call-log-history.svg";
import CallLogParticipantsSVG from "../../assets/call-log-participants.svg";
import CallLogRecordingsSVG from "../../assets/call-log-recordings.svg";
import CallLogSVG from "../../assets/call-logs.svg";
import { CardList } from "../CardList";
import { ICardProps } from "../Card";
import Sidebar from "../../assets/sidebar.png";

const cardDataList : Omit<ICardProps, "onClick">[] = [
    {
        title: "call buttons",
        description: "CometChatCallButtons is an independent component used to initiate 1v1 and direct calling",
        imageInfo: {
            url: Sidebar,
            altText: "sidebar"
        }
    },
    {
        title: "call logs",
        description: "CometChatCallLogs is an independent component used to display call logs",
        imageInfo: {
            url: CallLogSVG ,
            altText: "sidebar"
        }
    },
    {
        title: "call log details",
        description: "CometChatCallLogDetails is an independent component used to display call log details",
        imageInfo: {
            url: CallLogSVG,
            altText: "sidebar"
        }
    },
    {
        title: "call log history",
        description: "CometChatCallLogHistory is an independent component used to display call log history",
        imageInfo: {
            url: CallLogHistorySVG,
            altText: "sidebar"
        }
    },
    {
        title: "call log participants",
        description: "CometChatCallLogParticipants is an independent component used to display call log participants",
        imageInfo: {
            url: CallLogParticipantsSVG,
            altText: "sidebar"
        }
    },
    {
        title: "call log recordings",
        description: "CometChatCallLogRecordings is an independent component used to display call log recordings",
        imageInfo: {
            url: CallLogRecordingsSVG,
            altText: "sidebar"
        }
    },
    {
        title: "call logs with details",
        description: "CometChatCallLogs is an independent component used to display call logs with details",
        imageInfo: {
            url: CallLogSVG,
            altText: "sidebar"
        }
    }
];

export function CallsCardList() {
    return (
        <CardList 
            title = "calls"
            cardDataList = {cardDataList}
        />
    );
}
