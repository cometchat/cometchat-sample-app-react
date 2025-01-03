import { CometChatUIKitConstants } from '../../constants/CometChatUIKitConstants';
import React, { useEffect } from "react";
import { Action } from "./CometChatGroups";
import { GroupsManager } from "./controller";
import { CometChatUIKitUtility } from '../../CometChatUIKit/CometChatUIKitUtility';
import { CometChatGroupEvents } from '../../events/CometChatGroupEvents';

type Args = {
    groupsRequestBuilder: CometChat.GroupsRequestBuilder | null,
    searchRequestBuilder: CometChat.GroupsRequestBuilder | null,
    searchText: string,
    fetchNextIdRef: React.MutableRefObject<string>,
    groupsManagerRef: React.MutableRefObject<GroupsManager | null>,
    dispatch: React.Dispatch<Action>,
    fetchNextAndAppendGroups: (fetchId: string) => Promise<void>,
    groupsSearchText: React.MutableRefObject<string>,
    errorHandler: (error: unknown, source?: string | undefined) => void,
};

export function useCometChatGroups(args: Args) {
    const {
        groupsRequestBuilder,
        searchRequestBuilder,
        searchText,
        fetchNextIdRef,
        groupsManagerRef,
        dispatch,
        fetchNextAndAppendGroups,
        groupsSearchText,
        errorHandler
    } = args;


    useEffect(() => {
        /**
         * Updates the current search keyword for groups from `groupsRequestBuilder` or `searchRequestBuilder`.
         * Runs whenever either builder changes.
         */
        try {
            if (groupsRequestBuilder?.searchKeyword) {
                groupsSearchText.current = groupsRequestBuilder?.searchKeyword;
            } else if (searchRequestBuilder?.searchKeyword) {
                groupsSearchText.current = searchRequestBuilder?.searchKeyword;
            }
        } catch (error) {
            errorHandler(error, 'useEffect');
        }
    }, []);

    useEffect(
        /**
         * Creates a new request builder -> empties the `groupList` state -> initiates a new fetch
         */
        () => {
            try {
                dispatch({ type: "setIsFirstReload", isFirstReload: true });
                dispatch({ type: "setGroupList", groupList: [] });
                groupsManagerRef.current = new GroupsManager({ searchText, groupsRequestBuilder, searchRequestBuilder, groupsSearchText });
                fetchNextAndAppendGroups(fetchNextIdRef.current = "initialFetch_" + String(Date.now()));
            } catch (error) {
                errorHandler(error, 'useEffect');
            }
        }, [fetchNextAndAppendGroups, groupsRequestBuilder, searchRequestBuilder, searchText, dispatch, fetchNextIdRef, groupsManagerRef, groupsSearchText]);

    useEffect(
        /**
         * Attaches an SDK group listener
         *
         * @returns - Function to remove the added SDK group listener
         */
        () => {
            return GroupsManager.attachListeners(dispatch);
        }, [dispatch]);


    useEffect(
        /**
         * Subscribes to Group UI events
         */
        () => {
            try {
                const groupCreatedSub = CometChatGroupEvents.ccGroupCreated.subscribe((group: CometChat.Group) => {
                    dispatch({ type: "prependGroup", group: CometChatUIKitUtility.clone(group) });
                });
                const groupDeletedSub = CometChatGroupEvents.ccGroupDeleted.subscribe((group: CometChat.Group) => {
                    dispatch({ type: "removeGroup", guid: group.getGuid() });
                });
                const groupMemberJoinedSub = CometChatGroupEvents.ccGroupMemberJoined.subscribe((item) => {
                    dispatch({ type: "updateGroup", group: CometChatUIKitUtility.clone(item.joinedGroup) });
                });
                const groupMemberKickedSub = CometChatGroupEvents.ccGroupMemberKicked.subscribe((item) => {
                    dispatch({ type: "updateGroup", group: CometChatUIKitUtility.clone(item.kickedFrom) });
                });
                const groupMemberLeftSub = CometChatGroupEvents.ccGroupLeft.subscribe((item) => {
                    if (item.leftGroup.getType() === CometChatUIKitConstants.GroupTypes.private) {
                        dispatch({ type: "removeGroup", guid: item.leftGroup.getGuid() });
                    }
                    else {
                        dispatch({ type: "updateGroup", group: item.leftGroup });
                    }
                });
                const groupMemberBannedSub = CometChatGroupEvents.ccGroupMemberBanned.subscribe((item) => {
                    dispatch({ type: "updateGroup", group: item.kickedFrom });
                });
                const groupMemberAddedSub = CometChatGroupEvents.ccGroupMemberAdded.subscribe((item) => {
                    dispatch({ type: "updateGroup", group: item.userAddedIn });
                });
                const groupOwnershipChangedSub = CometChatGroupEvents.ccOwnershipChanged.subscribe((item) => {
                    dispatch({ type: "updateGroup", group: item.group });
                });
                return () => {
                    groupCreatedSub.unsubscribe();
                    groupDeletedSub.unsubscribe();
                    groupMemberJoinedSub.unsubscribe();
                    groupMemberKickedSub.unsubscribe();
                    groupMemberLeftSub.unsubscribe();
                    groupMemberBannedSub.unsubscribe();
                    groupMemberAddedSub.unsubscribe();
                    groupOwnershipChangedSub.unsubscribe();
                };
            } catch (error) {
                errorHandler(error, 'useEffect');
            }
        }, [dispatch]);

}
