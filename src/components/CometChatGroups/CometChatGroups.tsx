import { JSX, useCallback, useReducer, useRef } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatCheckbox } from "../BaseComponents/CometChatCheckbox/CometChatCheckbox";
import { CometChatList } from "../BaseComponents/CometChatList/CometChatList";
import { CometChatListItem } from "../BaseComponents/CometChatListItem/CometChatListItem";
import { CometChatRadioButton } from "../BaseComponents/CometChatRadioButton/CometChatRadioButton";
import { GroupsManager } from "./controller";
import { useCometChatGroups } from "./useCometChatGroups";
import { useCometChatErrorHandler } from "../../CometChatCustomHooks";
import { SelectionMode, States } from "../../Enums/Enums";
import { CometChatOption } from "../../modals";
import { localize } from "../../resources/CometChatLocalize/cometchat-localize";
import { CometChatContextMenu } from "../BaseComponents/CometChatContextMenu/CometChatContextMenu";
import emptyIcon from "../../assets/groups_empty_state.svg";
import emptyIconDark from "../../assets/groups_empty_state_dark.svg";
import errorIcon from "../../assets/list_error_state_icon.svg"
import errorIconDark from "../../assets/list_error_state_icon_dark.svg"
import { getThemeMode } from "../../utils/util";
interface GroupsProps {
    /**
     * Custom view to render on the top-right of the component
     */
    menu?: JSX.Element,
    /**
     * Title of the component
     *
     * @defaultValue `localize("GROUPS")`
    */
    title?: string,
    /**
     * Text to be displayed when the search input has no value
     *
     * @defaultValue `localize("SEARCH")`
     */
    searchPlaceholderText?: string,
    /**
     * Hide the search bar
     *
     * @defaultValue `false`
     */
    hideSearch?: boolean,
    /**
     * Request builder to fetch groups
     *
     * @remarks
     * If the search input is not empty and the `searchRequestBuilder` prop is not provided,
     * the search keyword of this request builder is set to the text in the search input
     *
     * @defaultValue Default request builder having the limit set to 30
     */
    groupsRequestBuilder?: CometChat.GroupsRequestBuilder,
    /**
     * Request builder with search parameters to fetch groups
     *
     * @remarks
     * If the search input is not empty,
     * the search keyword of this request builder is set to the text in the search input
     */
    searchRequestBuilder?: CometChat.GroupsRequestBuilder,
    /**
     * Function to call whenever the component encounters an error
     */
    onError?: ((error: CometChat.CometChatException) => void) | null,
    /**
     * Custom list item view to be rendered for each group in the fetched list
     */
    listItemView?: (group: CometChat.Group) => JSX.Element,
    /**
     * Custom subtitle view to be rendered for each group in the fetched list
     *
     * @remarks
     * This prop is used if `listItemView` prop is not provided
     */
    subtitleView?: (group: CometChat.Group) => JSX.Element,
    /**
     * List of actions available on mouse over on the default list item component
     */
    options?: (group: CometChat.Group) => CometChatOption[],
    /**
     * Selection mode to use for the default tail view
     *
     * @remarks
     * This prop is used if `listItemView` prop is not provided.
     *
     * @defaultValue `SelectionMode.none`
     */
    selectionMode?: SelectionMode,
    /**
     * Function to call when a group from the fetched list is selected
     *
     * @remarks
     * This prop is used if `selectionMode` prop is not `SelectionMode.none`
     */
    onSelect?: (group: CometChat.Group, selected: boolean) => void,
    /**
     * Function to call on click of the default list item view of a group
     */
    onItemClick?: (group: CometChat.Group) => void,
    /**
     * Group to highlight
     *
     * @remarks
     * This prop is used if `listItemView` prop is not provided
     */
    activeGroup?: CometChat.Group,
    /**
     * Custom view for the loading state of the component
     */
    loadingStateView?: JSX.Element,
    /**
     * Custom view for the empty state of the component
     */
    emptyStateView?: JSX.Element,
    /**
     * Custom view for the error state of the component
     */
    errorStateView?: JSX.Element,
    /**
     * Hide error view
     *
     * @remarks
     * If set to true, hides the default and the custom error view
     *
     * @defaultValue `false`
     */
    hideError?: boolean,
};

type State = {
    searchText: string,
    groupList: CometChat.Group[],
    fetchState: States,
    isFirstReload: boolean
};

export type Action = { type: "appendGroups", groups: CometChat.Group[], removeOldGroups?: boolean } |
{ type: "setGroupList", groupList: CometChat.Group[] } |
{ type: "setFetchState", fetchState: States } |
{ type: "updateGroup", group: CometChat.Group } |
{ type: "updateGroupForSDKEvents", group: CometChat.Group, newScope?: CometChat.GroupMemberScope, newCount?: number, hasJoined?: boolean, addGroup?: boolean } | 
{ type: "removeGroup", guid: string } |
{ type: "prependGroup", group: CometChat.Group } |
{ type: "setSearchText", searchText: string } |
{ type: "setIsFirstReload", isFirstReload: boolean };

var stateReducer = (state: State, action: Action): State => {
    let newState = state;
    const { type } = action;
    switch (type) {
        case "appendGroups":
            if (action.groups.length > 0) {
                let groups: CometChat.Group[] = []
                if (action.removeOldGroups) {
                    state.groupList = [];
                    groups = action.groups;
                }
                else {
                    groups = [...state.groupList, ...action.groups]
                }

                newState = { ...state, groupList: groups };
            }
            newState = { ...state, groupList: [...state.groupList, ...action.groups] };
            break;
        case "setGroupList":
            newState = { ...state, groupList: action.groupList };
            break;
        case "setFetchState":
            newState = { ...state, fetchState: action.fetchState };
            break;
        case "updateGroup": {
            const { groupList } = state;
            const { group: targetGroup } = action;
            const targetGuid = targetGroup.getGuid();
            const targetIdx = groupList.findIndex(group => group.getGuid() === targetGuid);
            if (targetIdx > -1) {
                newState = {
                    ...state, groupList: groupList.map((group, i) => {
                        return i === targetIdx ? targetGroup : group;
                    })
                };
            }
            break;
        }
        case "removeGroup": {
            const { groupList } = state;
            const targetGuid = action.guid;
            const targetIdx = groupList.findIndex(group => group.getGuid() === targetGuid);
            if (targetIdx > -1) {
                newState = { ...state, groupList: groupList.filter((group, i) => i !== targetIdx) };
            }
            break;
        }
        case "prependGroup":
            newState = { ...state, groupList: [action.group, ...state.groupList] };
            break;
        case "setSearchText":
            newState = { ...state, searchText: action.searchText };
            break;
        case "setIsFirstReload":
            newState = { ...state, isFirstReload: action.isFirstReload };
            break;
            case "updateGroupForSDKEvents": {
                const { groupList, searchText } = state;
                const { group, hasJoined, newScope, newCount, addGroup } = action;
                const targetGuid = group.getGuid();
                const targetIdx = groupList.findIndex(g => g.getGuid() === targetGuid);
    
                if (addGroup && searchText && searchText.length > 0) {
                    return state; 
                }
                if (targetIdx > -1) {
                    const updatedGroup = groupList[targetIdx];
    
                    if (hasJoined !== undefined) {
                        updatedGroup.setHasJoined(hasJoined);
                    }
                    if (newScope !== undefined) {
                        updatedGroup.setScope(newScope);
                    }
                    if(newCount!== undefined){
                    updatedGroup.setMembersCount(newCount);
                    }
                    newState = {
                        ...state,
                        groupList: groupList.map((g, i) =>
                            i === targetIdx ? updatedGroup : g
                        )
                    };
                }
                else if (addGroup) {
                    if (hasJoined !== undefined) {
                        group.setHasJoined(hasJoined);
                    }
                    if (newScope !== undefined) {
                        group.setScope(newScope);
                    }
                    if (newCount !== undefined) {
                        group.setMembersCount(newCount);
                    }
                    newState = {
                        ...state,
                        groupList: [group, ...groupList]
                    };
                }
                break;
            }        
        default: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const x: never = type;
        }
    }
    return newState;
}

/**
 * Renders a scrollable list of groups that has been created in a CometChat app
 */
export function CometChatGroups(props: GroupsProps) {
    const {
        menu,
        title = localize("GROUPS"),
        searchPlaceholderText = localize("SEARCH"),
        hideSearch = false,
        groupsRequestBuilder = null,
        searchRequestBuilder = null,
        onError,
        listItemView = null,
        subtitleView = null,
        options = null,
        selectionMode = SelectionMode.none,
        onSelect,
        onItemClick,
        activeGroup = null,
        loadingStateView,
        emptyStateView,
        errorStateView,
        hideError = false,
    } = props;

    const [state, dispatch] = useReducer(stateReducer, {
        searchText: "",
        groupList: [],
        fetchState: States.loading,
        isFirstReload: false
    });
    const groupsManagerRef = useRef<GroupsManager | null>(null);
    const fetchNextIdRef = useRef("");
    const errorHandler = useCometChatErrorHandler(onError);
    const attachListenerOnFetch = useRef<boolean>(false);
    const isConnectionReestablished = useRef<boolean>(false);
    const groupsSearchText = useRef<string>("");



    (() => {
        if (state.searchText !== groupsSearchText.current && state.searchText.trim().length > 0 && state.searchText.trim().length == state.searchText.length) {
            groupsSearchText.current = state.searchText;
        }
        if (state.isFirstReload) {
            attachListenerOnFetch.current = true;
            state.isFirstReload = false;
        }
    })();

    /**
     * Updates the `searchText` state
     */
    const onSearch = useCallback((searchText: string): void => {
        const trimmedText = searchText.trim();
        if (searchText.length === 0 || (trimmedText.length === searchText.length && trimmedText.length > 0)) {
            groupsSearchText.current = ""
            dispatch({ type: "setSearchText", searchText });
        }
    }, [dispatch]);

    /**
     * Initiates a fetch request and appends the fetched groups to the `groupList` state
     *
     * @remarks
     * This function also updates the `fetchState` state
     *
     * @param fetchId - Fetch Id to decide if the fetched data should be appended to the `groupList` state
     */
    const fetchNextAndAppendGroups = useCallback(async (fetchId: string): Promise<void> => {
        const groupsManager = groupsManagerRef.current;
        if (!groupsManager) {
            return;
        }
        let initialState = isConnectionReestablished.current ? States.loaded : States.loading
        dispatch({ type: "setFetchState", fetchState: initialState });
        try {
            const groups = await groupsManager.fetchNext();
            if (fetchId !== fetchNextIdRef.current) {
                return;
            }
            if (groups.length !== 0) {
                let removeOldGroups = isConnectionReestablished.current ? true : false;
                dispatch({ type: "appendGroups", groups, removeOldGroups });
            }
            dispatch({ type: "setFetchState", fetchState: States.loaded });
            if (attachListenerOnFetch.current) {
                GroupsManager.attachConnestionListener(() => {
                    const requestBuilder = groupsRequestBuilder === null ? new CometChat.GroupsRequestBuilder().setLimit(30) : groupsRequestBuilder;
                    groupsManagerRef.current = new GroupsManager({ searchText: groupsSearchText.current, groupsRequestBuilder: requestBuilder, searchRequestBuilder, groupsSearchText });
                    isConnectionReestablished.current = true;
                });
                attachListenerOnFetch.current = false;

            }
            if (!isConnectionReestablished.current) {
                dispatch({ type: "setFetchState", fetchState: States.loaded });
            }
            else {
                isConnectionReestablished.current = false;
            }
        }
        catch (error: unknown) {
            if (fetchId === fetchNextIdRef.current && state.groupList?.length <= 0) {
                dispatch({ type: "setFetchState", fetchState: States.error });
            }
            errorHandler(error);
        }
    }, [errorHandler, dispatch]);


    /**
     * Creates a subtitle view for the default list item view
     */
    function getSubtitleView(group: CometChat.Group): JSX.Element {
        if (subtitleView !== null) {
            return subtitleView(group);
        }
        const membersCount = group.getMembersCount();
        return (
            <div
                className="cometchat-groups__subtitle"
            >
                {`${membersCount} ${membersCount > 1 ? localize("MEMBERS") : localize("MEMBER")}`}
            </div>
        );
    }

    /**
     * Creates a menu view for the default list item view
     *
     * @remarks
     * This menu view is shown on mouse over the default list item view.
     * The visibility of view is handled by the default list item view
     */
    function getMenuView(group: CometChat.Group): JSX.Element | null {
        let curOptions: CometChatOption[] | undefined;
        if (!(curOptions = options?.(group))?.length) {
            return null;
        }
        return (
            <CometChatContextMenu
                data={curOptions}
                onOptionClicked={(e: CometChatOption) => e.onClick?.()}
            />
        );
    }

    /**
     * Creates a tail view for the default list item view
     */
    function getTailView(group: CometChat.Group): JSX.Element | null | undefined {
        switch (selectionMode) {
            case SelectionMode.none:
                return null;
            case SelectionMode.single: {
                return (
                    <CometChatRadioButton
                        onRadioButtonChanged={e => onSelect?.(group, e.checked)}
                    />
                );
            }
            case SelectionMode.multiple: {
                return (
                    <CometChatCheckbox
                        onCheckBoxValueChanged={e => onSelect?.(group, e.checked)}
                    />
                );
            }
            default: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const x: never = selectionMode;
            }
        }
    }

    /**
     * Creates `listItem` prop of the `CometChatList` component
     */
    function getListItem(): (group: CometChat.Group) => JSX.Element {
        if (listItemView !== null) {
            return listItemView;
        }
        return function (group: CometChat.Group) {
            const groupType = group.getType()
            const isActive = activeGroup?.getGuid() === group.getGuid();
            let newGroup = isActive ? activeGroup : group
            return (
                <div className={`cometchat-groups__list-item cometchat-groups__list-item-${groupType}
                ${isActive ? `cometchat-groups__list-item-active` : ""}
                `}>
                    <CometChatListItem
                        id={newGroup.getGuid()}
                        avatarURL={newGroup.getIcon()}
                        avatarName={newGroup.getName()}
                        title={newGroup.getName()}
                        subtitleView={getSubtitleView(newGroup)}
                        menuView={getMenuView(newGroup)}
                        tailView={getTailView(newGroup)}
                        onListItemClicked={e => onItemClick?.(newGroup)}
                    />
                </div>
            );
        };
    }

    /**
     * Renders the loading state view with shimmer effect
     *
     * @remarks
     * If a custom `loadingStateView` is provided, it will be used. Otherwise, the default shimmer effect is displayed.
     *
     * @returns A JSX element representing the loading state
     */
    const getLoadingView = () => {
        if (loadingStateView) {
            return loadingStateView
        }
        return <div className="cometchat-groups__shimmer">
            {[...Array(15)].map((_, index) => (
                <div key={index} className="cometchat-groups__shimmer-item">
                    <div className="cometchat-groups__shimmer-item-avatar"></div>
                    <div className="cometchat-groups__shimmer-item-body">
                        <div className="cometchat-groups__shimmer-item-body-title"></div>
                        <div className="cometchat-groups__shimmer-item-body-subtitle"></div>
                    </div>
                </div>
            ))}
        </div>
    }

    /**
     * Renders the empty state view when there are no groups to display
     *
     * @remarks
     * If a custom `emptyStateView` is provided, it will be used. Otherwise, a default empty state view with a message is displayed.
     *
     * @returns A JSX element representing the empty state
     */
    const getEmptyStateView = () => {
        const isDarkMode = getThemeMode() == "dark" ? true : false;

        if (emptyStateView) {
            return emptyStateView
        }

        return (
            <div className="cometchat-groups__empty-state-view">
                <div className="cometchat-groups__empty-state-view-icon">
                <img src={isDarkMode ? emptyIconDark : emptyIcon} alt="" />
                </div>
                <div className="cometchat-groups__empty-state-view-body">
                    <div className="cometchat-groups__empty-state-view-body-title">{localize("NO_GROUPS_AVAILABLE")}</div>
                    <div className="cometchat-groups__empty-state-view-body-description">{localize("GROUPS_EMPTY_STATE_MESSAGE")}</div>
                </div>
            </div>
        )
    }

    /**
     * Renders the error state view when an error occurs
     *
     * @remarks
     * If a custom `errorStateView` is provided, it will be used. Otherwise, a default error message is displayed.
     *
     * @returns A JSX element representing the error state
     */
    const getErrorStateView = () => {

        const isDarkMode = getThemeMode() == "dark" ? true : false;

        if (errorStateView) {
            return errorStateView
        }

        return (
            <div className="cometchat-groups__error-state-view">
                <div className="cometchat-groups__error-state-view-icon">
                <img src={isDarkMode ? errorIconDark : errorIcon} alt="" />
                </div>
                <div className="cometchat-groups__error-state-view-body">
                    <div className="cometchat-groups__error-state-view-body-title">{localize("OOPS!")}</div>
                    <div className="cometchat-groups__error-state-view-body-description">{localize("LOOKS_LIKE_SOMETHING_WENT_WRONG")}
                    </div>
                </div>
            </div>
        )
    }


    useCometChatGroups({
        searchText: state.searchText,
        groupsRequestBuilder,
        searchRequestBuilder,
        fetchNextIdRef,
        groupsManagerRef,
        dispatch,
        fetchNextAndAppendGroups,
        groupsSearchText
    });

    return (
        <div className="cometchat" style={{ width: "100%", height: "100%" }}>
            <div
                className="cometchat-groups">
                <CometChatList
                    title={title}
                    searchPlaceholderText={searchPlaceholderText}
                    hideSearch={hideSearch}
                    searchText={state.searchText}
                    onSearch={onSearch}
                    list={state.groupList}
                    listItem={getListItem()}
                    onScrolledToBottom={() => fetchNextAndAppendGroups(fetchNextIdRef.current = "onScrolledToBottom_" + String(Date.now()))}
                    listItemKey="getGuid"
                    showSectionHeader={false}
                    state={state.fetchState === States.loaded && state.groupList.length === 0 ? States.empty : state.fetchState}
                    loadingView={getLoadingView()}
                    emptyStateView={getEmptyStateView()}
                    errorStateView={getErrorStateView()}
                    hideError={hideError}
                    menu={menu}
                />
            </div>
        </div>
    );
}
