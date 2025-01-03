import { useCallback, useMemo } from "react";
import "../../styles/CometChatCallLog/CometChatCallLogParticipants.css";
import { CometChatDate, CometChatList, CometChatListItem, DatePatterns, States } from "@cometchat/chat-uikit-react";

export const CometChatCallDetailsParticipants = (props: { call: any }) => {
    const { call } = props;

    const getCallParticipants = useCallback(() => {
        return call?.getParticipants();
    }, [call]);

    function convertMinutesToHoursMinutesSeconds(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.floor(minutes % 60);
        const seconds = Math.floor((minutes - Math.floor(minutes)) * 60);

        let hoursString = "";
        let minutesString = "";
        let secondsString = "";

        if (hours > 0) {
            hoursString = `${hours}h`;
        }

        if (remainingMinutes > 0) {
            minutesString = `${remainingMinutes}m`;
        }

        if (seconds >= 0) {
            secondsString = `${seconds}s`;
        }

        return `${hoursString} ${minutesString} ${secondsString}`;
    }

    const getDurationOfCall = (item: any) => {
        if (item?.getHasJoined() || item?.getJoinedAt()) {
            return convertMinutesToHoursMinutesSeconds(item?.getTotalDurationInMinutes());
        } else {
            return convertMinutesToHoursMinutesSeconds(0);
        }
    }

    const getListItemSubtitleView = useCallback((item: any): JSX.Element => {
        return (
            <CometChatDate
                timestamp={call.initiatedAt}
                pattern={DatePatterns.DateTime}
            />
        );
    }, [call])

    const getListItemTailView = useCallback((item: any): JSX.Element => {
        return (
            <div
                className={item?.getHasJoined() || item?.getJoinedAt() ? "cometchat-call-log-participants__trailing-view" : "cometchat-call-log-participants__trailing-view-disabled" }
            >
                {getDurationOfCall(item)}
            </div>
        );
    }, [call])


    const getListItem = useMemo(() => {
        return function (item: any, index: number): any {
            return (
                <>
                    <CometChatListItem
                        title={item?.getName()}
                        avatarURL={item?.getAvatar()}
                        avatarName={item?.getName()}
                        subtitleView={getListItemSubtitleView(item)}
                        trailingView={getListItemTailView(item)}
                    />
                </>
            )
        }
    }, [getListItemSubtitleView, getListItemTailView]);


    return (
        <div className="cometchat-call-log-participants">
            <CometChatList
                hideSearch={true}
                list={getCallParticipants() || []}
                itemView={getListItem}
                listItemKey="getUid"
                state={States.loaded}
                showSectionHeader={false}
            />
        </div>
    )
}