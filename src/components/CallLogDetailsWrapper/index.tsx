import { CallLog, CallUser } from "@cometchat/calls-sdk-javascript";
import {
    CometChatCallLogDetails,
    CometChatIncomingCall,
    CometChatPalette,
    CometChatTheme,
    CometChatThemeContext,
    CometChatUIKit,
} from "@cometchat/chat-uikit-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useLocation } from "react-router-dom";

export function CallLogDetailsWrapper({ isMobileView }: { isMobileView: boolean }) {
    const { state } = useLocation();
    const changeThemeToCustom = state?.changeThemeToCustom;
    const { theme } = useContext(CometChatThemeContext);
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const [call, setCall] = useState<any>(null);

    const themeContext = useMemo(() => {
        let res = theme;
        if (changeThemeToCustom) {
            res = new CometChatTheme({
                palette: new CometChatPalette({
                    mode: theme.palette.mode,
                    primary: {
                        light: "#D422C2",
                        dark: "#D422C2",
                    },
                    accent: {
                        light: "#07E676",
                        dark: "#B6F0D3",
                    },
                    accent50: {
                        light: "#39f",
                        dark: "#141414",
                    },
                    accent900: {
                        light: "white",
                        dark: "black",
                    },
                }),
            });
        }
        return { theme: res };
    }, [theme, changeThemeToCustom]);

    const getCall = useCallback(() => {
        const initiator = CallUser.getUserFromJson({
            name: loggedInUser?.name,
            avatar: loggedInUser?.avatar,
            uid: loggedInUser?.uid,
        });

        const receiver = CallUser.getUserFromJson({
            name: "Kevin",
            avatar:
                "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
            uid: "UID233",
        });

        const call = CallLog.callLogFromJson({
            initiator,
            receiver,
            participants: [
                {
                    uid: loggedInUser?.uid,
                    avatar: loggedInUser?.avatar,
                    name: loggedInUser?.name,
                    totalAudioMinutes: 120,
                    totalDurationInMinutes: 120,
                    totalVideoMinutes: 60,
                },
                {
                    uid: "UID233",
                    avatar:
                        "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
                    name: "Kevin",
                    totalAudioMinutes: 120,
                    totalDurationInMinutes: 120,
                    totalVideoMinutes: 60,
                },
            ],
            recordings: [
                {
                    startTime: 101,
                    rid: "Recordings",
                    recording_url:
                        "https://recordings-us.cometchat.io/236497dcc2cd529b/2023-12-15/v1.us.236497dcc2cd529b.170264141733632a2e3171d8a5dcb1f82b743fbc2730422263_2023-12-15-11-57-16.mp4",
                    endTime: 101,
                    duration: 100,
                },
            ],
            totalDurationInMinutes: 0.6833333333333333,
            totalParticipants: 2,
            type: "audio",
            mid: "dcb170b0-99da-4beb-b65a8-86e48c89ef18",
            startedAt: 1697458341,
            endedAt: 1697458382,
            totalAudioMinutes: 0.6833333333333333,
            totalVideoMinutes: 0,
            totalDuration: "00:00:41",
            hasRecording: true,
            initiatedAt: 1697458328,
        });
        console.log(call);

        return call;
    }, [loggedInUser?.avatar, loggedInUser?.name, loggedInUser?.uid]);

    useEffect(() => {        
        CometChatUIKit.getLoggedinUser().then((user) => {
            setLoggedInUser(user!);            
            setCall(getCall());
        });
    }, [getCall]);

    return (
        <CometChatThemeContext.Provider value={themeContext}>
            {
                call && (
                    <CometChatCallLogDetails
                        call={call}
                    />
                )
            }
            <CometChatIncomingCall />
        </CometChatThemeContext.Provider>
    );
}
