
import {
  JSX,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";
import {
  useCometChatErrorHandler,
  useRefSync,
  useStateRef,
} from "../../CometChatCustomHooks";

import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatCheckbox } from "../BaseComponents/CometChatCheckbox/CometChatCheckbox";
import { CometChatList } from "../BaseComponents/CometChatList/CometChatList";
import { CometChatListItem } from "../BaseComponents/CometChatListItem/CometChatListItem";
import { CometChatRadioButton } from "../BaseComponents/CometChatRadioButton/CometChatRadioButton";
import { GroupMembersManager } from "./controller";
import { Hooks } from "./useCometChatGroupMembers";
import { CometChatUIKitUtility } from "../../CometChatUIKit/CometChatUIKitUtility";
import { GroupMemberUtils } from "../../utils/GroupMemberUtils";
import { Placement, SelectionMode, States } from "../../Enums/Enums";
import { CometChatActionsIcon, CometChatOption } from "../../modals";
import { localize } from "../../resources/CometChatLocalize/cometchat-localize";
import { CometChatUIKitConstants } from "../../constants/CometChatUIKitConstants";
import { CometChatChangeScope, } from "../BaseComponents/CometChatChangeScope/CometChatChangeScope";
import { CometChatContextMenu } from "../BaseComponents/CometChatContextMenu/CometChatContextMenu";
import emptyIcon from "../../assets/groups_empty_state.svg";
import emptyIconDark from "../../assets/groups_empty_state_dark.svg";
import errorIcon from "../../assets/list_error_state_icon.svg"
import errorIconDark from "../../assets/list_error_state_icon_dark.svg"
import { CometChatGroupEvents } from "../../events/CometChatGroupEvents";
import { getThemeMode } from "../../utils/util";

interface GroupMembersProps {
  /**
   * Custom view to render on the top-right of the component
   */
  menu?: JSX.Element;
  /**
   * Title of the component
   *
   * @defaultValue `localize("MEMBERS")`
   */
  title?: string;
  /**
   * Text to be displayed when the search input has no value
   *
   * @defaultValue `localize("SEARCH")`
   */
  searchPlaceholderText?: string;
  /**
   * Hide the search bar
   *
   * @defaultValue `false`
   */
  hideSearch?: boolean;
  /**
   * Request builder to fetch group members
   *
   * @remarks
   * If the search input is not empty and the `searchRequestBuilder` prop is not provided,
   * the search keyword of this request builder is set to the text in the search input
   *
   * @defaultValue Default request builder having the limit set to 30
   */
  groupMemberRequestBuilder?: CometChat.GroupMembersRequestBuilder;
  /**
   * Request builder with search parameters to fetch group members
   *
   * @remarks
   * If the search input is not empty,
   * the search keyword of this request builder is set to the text in the search input
   */
  searchRequestBuilder?: CometChat.GroupMembersRequestBuilder;
  /**
   * Group the fetched groupMembers belong to
   */
  group: CometChat.Group;
  /**
   * Function to call whenever the component encounters an error
   */
  onError?: ((error: CometChat.CometChatException) => void) | null;
  /**
   * Custom view for the loading state of the component
   */
  loadingStateView?: JSX.Element;
  /**
   * Custom view for the empty state of the component
   */
  emptyStateView?: JSX.Element;
  /**
   * Custom view for the error state of the component
   */
  errorStateView?: JSX.Element;
  /**
   * Hide error view
   *
   * @remarks
   * If set to true, hides the default and the custom error view
   *
   * @defaultValue `false`
   */
  hideError?: boolean;
  /**
   * Hide user presence
   *
   * @remarks
   * If set to true, the status indicator of the default list item view is not displayed
   *
   * @defaultValue `false`
   */
  disableUsersPresence?: boolean;
  /**
   * Custom subtitle view to be rendered for each group member in the fetched list
   *
   * @remarks
   * This prop is used if `listItemView` prop is not provided
   */
  subtitleView?: (groupMember: CometChat.GroupMember) => JSX.Element;
  /**
   * Custom list item view to be rendered for each group member in the fetched list
   */
  listItemView?: (groupMember: CometChat.GroupMember) => JSX.Element;
  /**
   * List of actions available on mouse over on the default list item component
   */
  options?: (
    group: CometChat.Group,
    groupMember: CometChat.GroupMember
  ) => CometChatOption[];

  /**
   * View to be placed in the tail view
   *
   * @remarks
   * This prop will be used if `listItemView` is not provided
   */
  tailView?: (groupMember: CometChat.GroupMember) => JSX.Element;
  /**
   * Selection mode to use for the default list item view
   *
   * @remarks
   * This prop is used if `listItemView` prop is not provided
   *
   * @defaultValue `SelectionMode.none`
   */
  selectionMode?: SelectionMode;
  /**
   * Function to call on click of the default list item view of a group member
   */
  onItemClick?: (groupMember: CometChat.GroupMember) => void;
  /**
   * Function to call when a group member from the fetched list is selected
   *
   * @remarks
   * This prop is used if `selectionMode` prop is not `SelectionMode.none`
   */
  onSelect?: (groupMember: CometChat.GroupMember, selected: boolean) => void;
  /**
   * Search keyword to filter the list of users.
   *
   * @defaultValue `""`
   */
  searchKeyword?: string;
  /**
   * Callback function to be executed when the user list is empty.
   */
  onEmpty?: () => void;
  /**
   * Flag to indicate whether to disable loading state while fetching users.
   * @defaultValue `false`
   */
  disableLoadingState?: boolean;
}

type State = {
  groupMemberList: CometChat.GroupMember[];
  fetchState: States;
  searchText: string;
  groupMemberToChangeScopeOf: CometChat.GroupMember | null;
  disableLoadingState: boolean;
};

export type Action =
  | {
    type: "appendGroupMembers";
    groupMembers: CometChat.GroupMember[];
    groupMembersManager?: GroupMembersManager | null;
    onEmpty?: () => void;
    disableLoadingState?: boolean;
  }
  | { type: "setGroupMemberList"; groupMemberList: CometChat.GroupMember[] }
  | { type: "setSearchText"; searchText: string }
  | { type: "setFetchState"; fetchState: States }
  | { type: "removeGroupMemberIfPresent"; groupMemberUid: string }
  | {
    type: "setGroupMemberToChangeScopeOf";
    groupMember: CometChat.GroupMember | null;
  }
  | {
    type: "replaceGroupMemberIfPresent";
    updatedGroupMember: CometChat.GroupMember;
  }
  | { type: "updateGroupMemberStatusIfPresent"; user: CometChat.User }
  | {
    type: "updateGroupMemberScopeIfPresent";
    groupMemberUid: string;
    newScope: CometChat.GroupMemberScope;
  }
  | { type: "appendGroupMember"; groupMember: CometChat.GroupMember };

function stateReducer(state: State, action: Action): State {
  let newState = state;
  const { type } = action;
  switch (type) {
    case "appendGroupMembers": {
      const { groupMembers, groupMembersManager, onEmpty, disableLoadingState } = action;
      if (
        (groupMembersManager &&
          [0].includes(groupMembersManager?.getCurrentPage()) && !groupMembers.length)) {
        if (!groupMembers.length && onEmpty) {
          setTimeout(() => {
            onEmpty();
          });
          newState = {
            ...state,
            fetchState: States.empty,
          };
        }
      } else if (groupMembers.length !== 0) {
        newState = {
          ...state,
          groupMemberList:
            disableLoadingState
              ? [...groupMembers]
              : [...state.groupMemberList, ...groupMembers],
        };
      }
      break;
    }
    case "setSearchText":
      newState = { ...state, searchText: action.searchText };
      break;
    case "setFetchState":
      newState = { ...state, fetchState: action.fetchState };
      break;
    case "setGroupMemberList":
      newState = { ...state, groupMemberList: action.groupMemberList };
      break;
    case "removeGroupMemberIfPresent": {
      const targetUid = action.groupMemberUid;
      const targetIdx = state.groupMemberList.findIndex(
        (groupMember) => groupMember.getUid() === targetUid
      );
      if (targetIdx > -1) {
        newState = {
          ...state,
          groupMemberList: state.groupMemberList.filter(
            (groupMember, i) => i !== targetIdx
          ),
        };
      }
      break;
    }
    case "setGroupMemberToChangeScopeOf":
      newState = { ...state, groupMemberToChangeScopeOf: action.groupMember };
      break;
    case "replaceGroupMemberIfPresent": {
      const { updatedGroupMember } = action;
      const targetUid = updatedGroupMember.getUid();
      const targetIdx = state.groupMemberList.findIndex(
        (groupMember) => groupMember.getUid() === targetUid
      );
      if (targetIdx > -1) {
        newState = {
          ...state,
          groupMemberList: state.groupMemberList.map((groupMember, i) => {
            if (i !== targetIdx) {
              return groupMember;
            }

            return updatedGroupMember;
          }),
        };
      }
      break;
    }
    case "updateGroupMemberStatusIfPresent": {
      const { user } = action;
      const { groupMemberList } = state;
      const targetUid = user.getUid();
      const targetIdx = groupMemberList.findIndex(
        (groupMember) => groupMember.getUid() === targetUid
      );
      if (targetIdx > -1) {
        newState = {
          ...state,
          groupMemberList: groupMemberList.map((groupMember, i) => {
            if (i === targetIdx) {
              groupMember.setStatus(user.getStatus());
            }
            return groupMember;
          }),
        };
      }
      break;
    }
    case "updateGroupMemberScopeIfPresent": {
      const { groupMemberUid, newScope } = action;
      const { groupMemberList } = state;
      const targetIdx = groupMemberList.findIndex(
        (groupMember) => groupMember.getUid() === groupMemberUid
      );
      if (targetIdx > -1) {
        newState = {
          ...state,
          groupMemberList: groupMemberList.map((groupMember, i) => {
            if (i === targetIdx) {
              groupMember.setScope(newScope);
            }
            return groupMember;
          }),
        };
      }
      break;
    }
    case "appendGroupMember": {
      newState = {
        ...state,
        groupMemberList: [...state.groupMemberList, action.groupMember],
      };
      break;
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const x: never = type;
    }
  }
  return newState;
}

export function CometChatGroupMembers(props: GroupMembersProps) {
  const {
    menu,
    title = localize("GROUP_MEMBERS"),
    searchPlaceholderText = localize("SEARCH"),
    hideSearch = false,
    groupMemberRequestBuilder = null,
    searchRequestBuilder = null,
    group,
    onError,
    loadingStateView,
    errorStateView,
    emptyStateView,
    hideError = false,
    disableUsersPresence = false,
    subtitleView = null,
    listItemView = null,
    options = null,
    tailView = null,
    selectionMode = SelectionMode.none,
    onItemClick = null,
    onSelect = null,
    searchKeyword = "",
    onEmpty,
    disableLoadingState = false,
  } = props;

  const [state, dispatch] = useReducer(stateReducer, {
    groupMemberList: [],
    fetchState: States.loading,
    searchText: "",
    groupMemberToChangeScopeOf: null,
    disableLoadingState,
  });
  const groupMembersManagerRef = useRef<GroupMembersManager | null>(null);
  const loggedInUserRef = useRef<CometChat.User | null>(null);
  const fetchNextIdRef = useRef("");

  const groupPropRef = useRefSync(group);
  const errorHandler = useCometChatErrorHandler(onError);
  const groupMembersSearchText = useRef<string>("");

  /**
   * Updates the `searchText` state
   */
  const onSearchTextChange = useCallback(
    (searchText: string): void => {
      const trimmedText = searchText.trim();
      if (
        searchText.length === 0 ||
        (trimmedText.length === searchText.length && trimmedText.length > 0)
      ) {
        groupMembersSearchText.current = "";
        dispatch({ type: "setSearchText", searchText });
      }
    },
    [dispatch]
  );

  /**
   * Initiates a fetch request and appends the fetched group members to the `groupMemberList` state
   *
   * @remarks
   * This function also updates the `fetchState` state
   *
   * @param fetchId - Fetch Id to decide if the fetched data should be appended to the `groupMemberList` state
   */
  const fetchNextAndAppendGroupMembers = useCallback(
    async (fetchId: string): Promise<void> => {
      const groupMembersManager = groupMembersManagerRef.current;
      if (!groupMembersManager) {
        return;
      }
      if (!disableLoadingState) {
        dispatch({ type: "setFetchState", fetchState: States.loading });
      }
      try {
        const groupMembers = await groupMembersManager.fetchNext();
        if (fetchId !== fetchNextIdRef.current) {
          return;
        }

        dispatch({
          type: "appendGroupMembers",
          groupMembers,
          groupMembersManager,
          onEmpty,
          disableLoadingState
        });

        dispatch({ type: "setFetchState", fetchState: States.loaded });
      } catch (error) {
        dispatch({ type: "setFetchState", fetchState: States.error });
        errorHandler(error);
      }
    },
    [dispatch, errorHandler]
  );

  /**
   * Creates an action message
   */
  const createActionMessage = useCallback(
    (
      actionOn: CometChat.GroupMember,
      action: string,
      group: CometChat.Group,
      loggedInUser: CometChat.User
    ): CometChat.Action => {
      const actionMessage = new CometChat.Action(
        group.getGuid(),
        CometChatUIKitConstants.MessageTypes.groupMember,
        CometChatUIKitConstants.MessageReceiverType.group,
        CometChatUIKitConstants.MessageCategory
          .action as CometChat.MessageCategory
      );
      actionMessage.setAction(action);
      actionMessage.setActionBy(CometChatUIKitUtility.clone(loggedInUser));
      actionMessage.setSender(CometChatUIKitUtility.clone(loggedInUser));
      actionMessage.setMessage(
        `${loggedInUser.getUid()} ${action} ${actionOn.getUid()}`
      );
      actionMessage.setActionFor(CometChatUIKitUtility.clone(group));
      actionMessage.setActionOn(CometChatUIKitUtility.clone(actionOn));
      actionMessage.setReceiver(CometChatUIKitUtility.clone(group));
      actionMessage.setConversationId("group_" + group.getGuid());
      actionMessage.setMuid(CometChatUIKitUtility.ID());
      actionMessage.setSentAt(CometChatUIKitUtility.getUnixTimestamp());
      actionMessage.setReceiverType(
        CometChatUIKitConstants.MessageReceiverType.group
      );
      actionMessage.setData({
        extras: {
          scope: {
            new: actionOn.getScope(),
          },
        },
      });
      return actionMessage;
    },
    []
  );

  /**
   * Bans the provided `groupMember`
   */
  const banGroupMember = async (
    groupMember: CometChat.GroupMember
  ): Promise<void> => {
    const loggedInUser = loggedInUserRef.current;
    if (!loggedInUser) {
      return;
    }
    try {
      const currentGroup = groupPropRef.current;
      await CometChat.banGroupMember(
        currentGroup.getGuid(),
        groupMember.getUid()
      );
      dispatch({
        type: "removeGroupMemberIfPresent",
        groupMemberUid: groupMember.getUid(),
      });
      const groupClone = CometChatUIKitUtility.clone(currentGroup);
      groupClone.setMembersCount(groupClone.getMembersCount() - 1);
      CometChatGroupEvents.ccGroupMemberBanned.next({
        kickedBy: CometChatUIKitUtility.clone(loggedInUser),
        kickedFrom: groupClone,
        kickedUser: CometChatUIKitUtility.clone(groupMember),
        message: createActionMessage(
          groupMember,
          CometChatUIKitConstants.groupMemberAction.BANNED,
          groupClone,
          loggedInUser
        ),
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  /**
   * Kicks the provided `groupMember`
   */
  const kickGroupMember = async (
    groupMember: CometChat.GroupMember
  ): Promise<void> => {
    const loggedInUser = loggedInUserRef.current;
    if (!loggedInUser) {
      return;
    }
    try {
      const currentGroup = groupPropRef.current;
      await CometChat.kickGroupMember(
        currentGroup.getGuid(),
        groupMember.getUid()
      );
      dispatch({
        type: "removeGroupMemberIfPresent",
        groupMemberUid: groupMember.getUid(),
      });
      const groupClone = CometChatUIKitUtility.clone(currentGroup);
      groupClone.setMembersCount(groupClone.getMembersCount() - 1);
      CometChatGroupEvents.ccGroupMemberKicked.next({
        kickedBy: CometChatUIKitUtility.clone(loggedInUser),
        kickedFrom: CometChatUIKitUtility.clone(groupClone),
        kickedUser: CometChatUIKitUtility.clone(groupMember),
        message: createActionMessage(
          groupMember,
          CometChatUIKitConstants.groupMemberAction.KICKED,
          groupClone,
          loggedInUser
        ),
      });
    } catch (error) {
      errorHandler(error);
    }
  };

  const { groupMemberToChangeScopeOf: groupMember } = state;

  /**
   * Updates the scope of the provided `groupMember`
   */
   const updateGroupMemberScope = useCallback(
     (newScope: string): Promise<void> => {
return new Promise<void>(async (resolve,reject)=>{
  const loggedInUser = loggedInUserRef.current;
  if (!groupMember || !loggedInUser) {
    return reject()
  }
  try {
    const newScopeCasted = newScope as CometChat.GroupMemberScope;
    const currentGroup = groupPropRef.current;
    await CometChat.updateGroupMemberScope(
      currentGroup.getGuid(),
      groupMember.getUid(),
      newScopeCasted
    );
    
    const updatedGroupMember = CometChatUIKitUtility.clone(groupMember);
    updatedGroupMember.setScope(newScopeCasted);
    dispatch({ type: "replaceGroupMemberIfPresent", updatedGroupMember });
    CometChatGroupEvents.ccGroupMemberScopeChanged.next({
      scopeChangedFrom: groupMember.getScope(),
      scopeChangedTo: updatedGroupMember.getScope(),
      message: createActionMessage(
        updatedGroupMember,
        CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE,
        currentGroup,
        loggedInUser
      ),
      group: CometChatUIKitUtility.clone(currentGroup),
      updatedUser: CometChatUIKitUtility.clone(updatedGroupMember),
    });
    return resolve()
  } catch (error) {
     reject()
    errorHandler(error);
  } finally {
    dispatch({ type: "setGroupMemberToChangeScopeOf", groupMember: null });
  }
})
    },
    [errorHandler, dispatch, createActionMessage, groupMember, groupPropRef]
  );

  /**
   * Handles user created action on a groupMember from the fetched list
   */
  function handleActionOnGroupMember(
    action: string,
    groupMember: CometChat.GroupMember
  ): void | Promise<void> {
    if (action === CometChatUIKitConstants.GroupMemberOptions.ban) {
      return banGroupMember(groupMember);
    }
    if (action === CometChatUIKitConstants.GroupMemberOptions.kick) {
      return kickGroupMember(groupMember);
    }
    if (action === CometChatUIKitConstants.GroupMemberOptions.changeScope) {
      return dispatch({ type: "setGroupMemberToChangeScopeOf", groupMember });
    }
  }


  /**
   * Creates the menu view of the default list item view
   */
  function getDefaultListItemMenuView(
    groupMember: CometChat.GroupMember
  ): JSX.Element | null {
    let groupMemberOptionsProps: CometChatOption[] | undefined;
    let groupMemberOptions = GroupMemberUtils.getViewMemberOptions(
      groupMember,
      group,
      loggedInUserRef.current?.getUid(),
    )

    if (typeof groupMemberOptions === "string") {
      return null
    }

    if (
      tailView === null &&
      (groupMemberOptionsProps = options?.(group, groupMember))?.length
    ) {
      return (
        <CometChatContextMenu
          placement={Placement.left}
          data={groupMemberOptionsProps as unknown as CometChatActionsIcon[]}
          onOptionClicked={(e: CometChatOption) => {
            const { id, onClick } = e;
            if (onClick) {
              onClick();
            } else if (typeof id === "string") {
              handleActionOnGroupMember(id, groupMember);
            }
          }}
        />
      );
    }
    return <>
      <CometChatContextMenu
        placement={Placement.left}
        topMenuSize={1}
        data={groupMemberOptions as unknown as CometChatActionsIcon[]}
        onOptionClicked={(e: CometChatOption) => {
          const { id, onClick } = e;
          if (onClick) {
            onClick();
          } else if (typeof id === "string") {
            handleActionOnGroupMember(id, groupMember);
          }
        }}
      />
    </>;
  }

  /**
   * Creates selection input component based on `selectionMode`
   */
  function getSelectionInput(
    groupMember: CometChat.GroupMember
  ): JSX.Element | null {
    if (selectionMode === SelectionMode.single) {
      return (
        <CometChatRadioButton
          onRadioButtonChanged={(e) => onSelect?.(groupMember, e.checked)}
        />
      );
    }
    if (selectionMode === SelectionMode.multiple) {
      return (
        <CometChatCheckbox
          onCheckBoxValueChanged={(e) => onSelect?.(groupMember, e.checked)}
        />
      );
    }
    return null;
  }

  /**
   * Creates options view of the default tail view
   *
   * @param groupMemberOptions - Return value of `GroupMemberUtils.getViewMemberOptions` function
   */
  function getDefaultTailOptionsView(
    groupMemberOptions: string | CometChatOption[],
    groupMember: CometChat.GroupMember
  ): JSX.Element {
    if (typeof groupMemberOptions === "string" && groupMemberOptions !== "participant") {
      return (
        <div className={`cometchat-group-members__tail-view-options cometchat-group-members__tail-view-options-${groupMemberOptions}`}>
          {localize(groupMemberOptions.toUpperCase())}
        </div>
      );
    }

    return <div className={`cometchat-group-members__tail-view-options cometchat-group-members__tail-view-options-${groupMember?.getScope()}`}>{groupMember?.getScope() !== CometChatUIKitConstants.groupMemberScope.participant && localize(groupMember?.getScope().toUpperCase())}</div>
  }

  /**
   * Creates the default tail view
   */
  function getDefaultTailView(
    groupMember: CometChat.GroupMember
  ): JSX.Element | null {
    if (tailView !== null) {
      return null;
    }
    return (
      <div className='cometchat-group-members__tail-view'>
        {getDefaultTailOptionsView(
          GroupMemberUtils.getViewMemberOptions(
            groupMember,
            group,
            loggedInUserRef.current?.getUid()),
          groupMember
        )}
      </div>
    );
  }

  /**
   * Creates the tail view for the default list item view
   */
  function getDefaultListItemTailView(
    groupMember: CometChat.GroupMember
  ): JSX.Element {
    return (
      <div>
        {tailView?.(groupMember)}
        {getSelectionInput(groupMember)}
        {getDefaultTailView(groupMember)}
      </div>
    );
  }


  /**
   * Creates the default list item view
   */
  function getDefaultListItemView(
    groupMember: CometChat.GroupMember
  ): JSX.Element {

    const status = groupMember.getStatus()
    return (
      <div
        className={`cometchat-group-members__list-item ${!disableUsersPresence ?  `cometchat-group-members__list-item-${status}` : ''}`}
      >
        <CometChatListItem
          id={groupMember.getUid()}
          title={groupMember.getName()}
          avatarURL={groupMember.getAvatar()}
          avatarName={groupMember.getName()}
          subtitleView={subtitleView?.(groupMember)}
          tailView={getDefaultListItemTailView(groupMember)}
          menuView={!tailView ? getDefaultListItemMenuView(groupMember) : null}
          onListItemClicked={(e) => onItemClick?.(groupMember)}
        />
      </div>
    );
  }

  /**
   * Gets the list item view of the component
   */
  function getListItem(): (groupMember: CometChat.GroupMember) => JSX.Element {
    return listItemView !== null ? listItemView : getDefaultListItemView;
  }

  /**
   * Closes the group member scope change modal by resetting the selected group member.
   * 
   * @returns {void}
   */
  function handleChangeScopeClose(): void {
    dispatch({ type: "setGroupMemberToChangeScopeOf", groupMember: null });
  }



  /**
   * Creates the group member scope change modal view
   */
  function getGroupMemberScopeChangeModal(): JSX.Element | null {
    let groupMemberAllowedScopes: string[];
    const { groupMemberToChangeScopeOf } = state;
    if (
      groupMemberToChangeScopeOf !== null &&
      (groupMemberAllowedScopes = GroupMemberUtils.allowScopeChange(
        group,
        groupMemberToChangeScopeOf
      )).length > 0

    ) {

      return (
        <div className="cometchat-group-members__backdrop">
          <CometChatChangeScope
            options={groupMemberAllowedScopes}
            defaultSelection={groupMemberToChangeScopeOf.getScope()}
            onScopeChanged ={updateGroupMemberScope}
            onCloseClick={handleChangeScopeClose}
          />
        </div>
      );
    }
    return null;
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
    return <div className="cometchat-group-members__shimmer">
      {[...Array(15)].map((_, index) => (
        <div key={index} className="cometchat-group-members__shimmer-item">
          <div className="cometchat-group-members__shimmer-item-avatar"></div>
          <div className="cometchat-group-members__shimmer-item-title"></div>
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
      <div className="cometchat-group-members__empty-state-view">
        <div className="cometchat-group-members__empty-state-view-icon">
          <img src={isDarkMode ? emptyIconDark : emptyIcon} alt="" />
        </div>
        <div className="cometchat-group-members__empty-state-view-body">
          <div className="cometchat-group-members__empty-state-view-body-title">{localize("NO_GROUP_MEMBER_AVAILABLE")}</div>
          <div className="cometchat-group-members__empty-state-view-body-description">{localize("GROUP_MEMBER_EMPTY_STATE_MESSAGE")}</div>
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
      <div className="cometchat-group-members__error-state-view">
        <div className="cometchat-group-members__error-state-view-icon">
          <img src={isDarkMode ? errorIconDark : errorIcon} alt="" />
        </div>
        <div className="cometchat-group-members__error-state-view-body">
          <div className="cometchat-group-members__error-state-view-body-title">{localize("OOPS!")}</div>
          <div className="cometchat-group-members__error-state-view-body-description">{localize("LOOKS_LIKE_SOMETHING_WENT_WRONG")}
          </div>
        </div>
      </div>
    )
  }


  Hooks({
    groupMemberRequestBuilder,
    searchRequestBuilder,
    searchText: state.searchText,
    groupMembersManagerRef,
    groupGuid: group.getGuid(),
    fetchNextAndAppendGroupMembers,
    fetchNextIdRef,
    dispatch,
    loggedInUserRef,
    errorHandler,
    updateGroupMemberScope,
    searchKeyword,
    disableLoadingState,
    groupMembersSearchText,
    disableUsersPresence
  });

  return (
    <div className="cometchat" style={{ width: "100%", height: "100%" }}>
      <div
        className='cometchat-group-members'
      >
        <CometChatList
          title={title}
          searchPlaceholderText={searchPlaceholderText}
          searchText={state.searchText}
          onSearch={onSearchTextChange}
          hideSearch={hideSearch}
          list={state.groupMemberList}
          listItemKey='getUid'
          listItem={getListItem()}
          showSectionHeader={false}
          onScrolledToBottom={() =>
            fetchNextAndAppendGroupMembers(
              (fetchNextIdRef.current =
                "onScrolledToBottom_" + String(Date.now()))
            )
          }
          state={state.fetchState === States.loaded && state.groupMemberList.length === 0 ? States.empty : state.fetchState}
          loadingView={getLoadingView()}
          emptyStateView={getEmptyStateView()}
          errorStateView={getErrorStateView()}
          hideError={hideError}
          menu={menu}
        />
        {getGroupMemberScopeChangeModal()}
      </div>

    </div>
  );
}