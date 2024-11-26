import React, { useEffect, useState, useRef, useCallback, UIEvent } from "react";
import { CometChat, ReactionCount } from "@cometchat/chat-sdk-javascript";
import { CometChatListItem } from "../../BaseComponents/CometChatListItem/CometChatListItem";
import { States } from "../../../Enums/Enums";
import { localize } from "../../../resources/CometChatLocalize/cometchat-localize";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";
import { CometChatUIKitLoginListener } from "../../../CometChatUIKit/CometChatUIKitLoginListener";

interface ReactionListProps {
    /* Base message object of which reaction info is viewed. */
    messageObject: CometChat.BaseMessage;
    /* Builder used to update the reactions details in message. */
    reactionsRequestBuilder?: CometChat.ReactionsRequestBuilder;
    /* Callback which is triggered when any of the reaction item is clicked. */
    reactionItemClicked?: (reaction: CometChat.Reaction, message: CometChat.BaseMessage) => void;
}

const CometChatReactionList: React.FC<ReactionListProps> = ({
    messageObject,
    reactionsRequestBuilder,
    reactionItemClicked,
}) => {
    const [messageReactions, setMessageReactions] = useState<CometChat.ReactionCount[]>([]);
    const [selectedReaction, setSelectedReaction] = useState<string>("all");
    const [requestBuilderMap, setRequestBuilderMap] = useState<Record<string, CometChat.ReactionsRequest>>({});
    const [reactionList, setReactionList] = useState<Record<string, CometChat.Reaction[]>>({});
    const [state, setState] = useState<States>(States.loading);
    const [currentUIList, setCurrentUIList] = useState<CometChat.Reaction[]>([]);
    const [messageUpdated, setMessageUpdated] = useState<boolean>(true);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const selectedRecRef = useRef<string>();

    const allText = localize("ALL");
    const subtitleText = localize("CLICK_TO_REMOVE");
    const youText = localize("YOU");
    const limit = CometChatUIKitConstants.requestBuilderLimits.reactionListLimit;
    const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
    const parentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (selectedReaction || messageObject) {
            if (messageObject) {
                setMessageUpdated(true);
            }
            showReactionsIfNeeded();
        }
    }, [selectedReaction, messageObject]);

    /* This function is used to check and set the reactions data. */
    const checkReaction = useCallback(
        () => {
            try {
                setMessageReactions(messageObject?.getReactions() || []);
            } catch (error) {
                console.log(error);
            }
        }, [messageObject]
    );

    /* Purpose of this function is to reset all the states used in the component. */
    const resetComponent = () => {
        setMessageReactions([]);
        setSelectedReaction("all");
        setRequestBuilderMap({});
        setReactionList({});
        setState(States.loading);
        setIsFirstRender(true);
    };

    /* This function returns a request builder which is used to fetch and update the reactions data. */
    const getRequestBuilder = useCallback(
        (reaction: string) => {
            let requestBuilder;
            if (requestBuilderMap[reaction]) {
                return requestBuilderMap[reaction];
            }

            if (reactionsRequestBuilder) {
                requestBuilder = reactionsRequestBuilder;
            } else {
                requestBuilder = new CometChat.ReactionsRequestBuilder().setLimit(
                    limit
                );
            }
            requestBuilder.setMessageId(messageObject?.getId());

            if (reaction !== "all") {
                requestBuilder.setReaction(reaction);
            }

            const request = requestBuilder.build();
            setRequestBuilderMap((prevState) => {
                return {
                    ...prevState, [reaction || "all"]: request
                }
            });
            return request;
        }, [requestBuilderMap]
    );

    /* This function is used to trigger the fetch reaction list logic and update the list state. */
    const showReactions = useCallback(
        async () => {
            const requestBuilder = getRequestBuilder(selectedRecRef.current!);
            const list = await getReactionList(requestBuilder, selectedRecRef.current!);
            setCurrentUIList(list);
        }, [selectedReaction, selectedRecRef, reactionList]
    );

    /* Purpose of this function is to fetch the reaction list data and retun the list. */
    const getReactionList = useCallback(async (requestBuilder: CometChat.ReactionsRequest, reaction: string) => {
        setState(States.loading);
        if (reactionList[reaction]) {
            setState(States.loaded);
            return reactionList[reaction];
        }

        try {
            let list = await requestBuilder.fetchNext();
            if (list.length == 0) {
                list = await requestBuilder.fetchPrevious();
            }
            setState(States.loaded);
            setReactionList((prev) => ({ ...prev, [reaction || "all"]: list }));
            return list;
        } catch (error) {
            setState(States.error);
            return [];
        }
    }, [reactionList]);

    /* This function is triggered when the component is rendered, to fetch and display the reaction data. */
    const showReactionsIfNeeded = useCallback(
        async () => {
            if (messageUpdated && isFirstRender) {
                resetComponent();
                setMessageUpdated(false);
                checkReaction();
                setIsFirstRender(false);
                await showReactions();
            } else if (selectedRecRef.current) {
                setMessageUpdated(false);
                checkReaction();
                await showReactions();
            }
        }, [isFirstRender, messageUpdated, setIsFirstRender, reactionList, selectedRecRef]
    );

    /* The purpose of this function is to trigger the fetch reaction data logic on scroll. */
    const fetchNext = useCallback(
        async () => {
            try {
                const requestBuilder = getRequestBuilder(selectedReaction);
                if (!reactionList[selectedReaction] || (reactionList[selectedReaction] && reactionList[selectedReaction].length === 0)) {
                    return;
                } else {
                    const newList = await requestBuilder.fetchNext();
                    setReactionList((prev) => ({
                        ...prev,
                        [selectedReaction]: [...prev[selectedReaction], ...newList],
                    }));
                    const updatedCurrentUIList = [...currentUIList, ...newList];
                    setCurrentUIList(updatedCurrentUIList);
                }
            } catch (error) {
                console.log(error);
            }
        }, [setSelectedReaction, selectedReaction, reactionList, currentUIList]
    );

    /* This function is used to return the total reactions count for a message. */
    const getTotalReactionCount = () => {
        return messageReactions.reduce((acc, reaction) => acc + reaction.getCount(), 0);
    };

    /* Purpose of this function is to check if the reaction is added by the logged in user. */
    const isMyReaction = (reaction: CometChat.Reaction) => {
        return loggedInUser?.getUid() === reaction?.getReactedBy()?.getUid();
    };

    /*
    * Purpose of this function is to remove the reaction from the message if the user clicks and removes the reaction. 
    * It is done locally using states.
    */
    const updateMessageToRemoveReactionLocally = (reaction: CometChat.Reaction) => {
        const message = messageObject;
        let changedSelectedReaction = false;

        if (message) {
            const reactions = message.getReactions();
            const index = reactions.findIndex((r) => r.getReaction() === reaction.getReaction());

            if (index !== -1) {
                const reactionCount = reactions[index].getCount();

                if (reactionCount === 1) {
                    reactions.splice(index, 1);
                    setSelectedReaction("all");
                    changedSelectedReaction = true;
                } else {
                    reactions[index].setCount(reactions[index].getCount() - 1);
                }
                updateCurrentUIList(reactions);
                setMessageReactions(reactions);
                if (changedSelectedReaction) {
                    setSelectedReaction("all");
                    selectedRecRef.current = undefined;
                }
            }
        }
    };

    /* The purpose of this function is to update the state for reaction list. */
    const updateCurrentUIList = (reactions: ReactionCount[]) => {
        const tempReactionsArray: CometChat.Reaction[] = [];
        reactions.forEach((reaction) => {
            const filteredReaction = reactionList["all"].filter((reactionItem) => {
                return reactionItem.getReaction() === reaction.getReaction();
            });
            tempReactionsArray.push(filteredReaction[0]);
        })
        setReactionList((prev) => ({ ...prev, ["all"]: tempReactionsArray }));
        setCurrentUIList(tempReactionsArray);
    }

    /* Purpose of this function is to return the slider component view for reactions. */
    const showReactionsSlider = useCallback(() => {
        const reactionsObject = [
            {
                id: "all",
                reaction: allText,
                count: getTotalReactionCount(),
            },
        ];

        messageReactions.forEach((reaction) => {
            reactionsObject.push({
                id: reaction.getReaction(),
                reaction: reaction.getReaction(),
                count: reaction.getCount(),
            });
        });

        return reactionsObject.map((reactionObject) => (
            <div
                className={`cometchat-reaction-list__tabs-tab ${selectedReaction === reactionObject.id && "cometchat-reaction-list__tabs-tab-active"}`}
                onClick={() => { setSelectedReaction(reactionObject.id); selectedRecRef.current = reactionObject.id }}
                key={reactionObject.id}
            >
                <div className={`cometchat-reaction-list__tabs-tab-emoji ${selectedReaction === reactionObject.id && "cometchat-reaction-list__tabs-tab-emoji-active"}`}>
                    {reactionObject.reaction}
                </div>
                <div className={`cometchat-reaction-list__tabs-tab-count ${selectedReaction === reactionObject.id && "cometchat-reaction-list__tabs-tab-count-active"}`}>
                    {reactionObject.count}
                </div>
            </div>
        ));
    }, [messageReactions, selectedReaction]);

    return (
        <div className="cometchat cometchat-reaction-list" ref={parentRef}>
            <div >
                {state === States.loading ? (
                    <>
                        <div className="cometchat-reaction-list__tabs">{showReactionsSlider()}</div>
                        <div className="cometchat-reaction-list__shimmer">
                            {Array.from({ length: 4 }).map((undefined, index) => (
                                <div className="cometchat-reaction-list__shimmer-item" key={index}>
                                    <div className="cometchat-reaction-list__shimmer-item-icon" />
                                    <div className="cometchat-reaction-list__shimmer-item-content" />
                                    <div className="cometchat-reaction-list__shimmer-item-tailview" />
                                </div>
                            ))}
                        </div>
                    </>
                ) : state === States.error ? (
                    <div className="cometchat-reaction-list__error">
                        {localize("ERROR_TEXT")}
                    </div>
                ) : state == States.loaded ? (
                    <div className="cometchat-reaction-container">
                        <div className="cometchat-reaction-list__tabs">{showReactionsSlider()}</div>
                        <div
                            className="cometchat-reaction-list__list"
                            onScroll={(e: UIEvent<HTMLDivElement> & { target: { scrollHeight: number, scrollTop: number, clientHeight: number } }) => {
                                const bottom =
                                    e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
                                if (bottom) {
                                    fetchNext();
                                }
                            }}
                        >
                            {currentUIList.map((reaction) => {
                                const isMe = loggedInUser?.getUid() === reaction?.getReactedBy()?.getUid();
                                return (
                                    <div className="cometchat-reaction-list__list-item" key={reaction?.getReactionId()}>
                                        <CometChatListItem
                                            title={isMe ? youText : reaction?.getReactedBy()?.getName()}
                                            subtitleView={isMe ? <div>
                                                {subtitleText}
                                            </div> : null}
                                            tailView={<div>
                                                {reaction?.getReaction()}
                                            </div>}
                                            avatarURL={reaction?.getReactedBy()?.getAvatar()}
                                            avatarName={reaction?.getReactedBy()?.getName()}
                                            onListItemClicked={() => {
                                                if (isMyReaction(reaction)) {
                                                    updateMessageToRemoveReactionLocally(reaction);
                                                }
                                                reactionItemClicked?.(reaction, messageObject);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default CometChatReactionList;
